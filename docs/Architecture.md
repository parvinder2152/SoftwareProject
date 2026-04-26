# System Architecture & Technical Design

This document details the architectural decisions, structural layers, and data flow mechanisms that power the Campus Event Hub (CEH). It is designed to provide software engineers and system architects with a deep understanding of how the platform operates under the hood.

---

## 1. High-Level System Architecture

The CEH platform adopts a decoupled, modern web architecture centered around the Next.js App Router framework. This architecture bridges the gap between traditional Single Page Applications (SPAs) and classic Server-Rendered applications by moving heavy lifting to the server while maintaining a highly interactive client experience.

```mermaid
graph TD
    Client[Client Browser / Mobile] -->|HTTP Requests / React Hydration| Edge[Vercel Edge Network]
    Edge -->|Server-Side Rendering| NextJS[Next.js Application Server]
    
    subgraph Frontend / Application Layer
        NextJS -->|Renders| UI[React Server Components]
        NextJS -->|Executes| API[Next.js API Routes]
    end
    
    API -->|PostgREST / TCP| Supabase[(Supabase PostgreSQL Database)]
    
    subgraph Data Persistence Layer
        Supabase --> Tables[Relational Tables]
        Supabase --> Auth[Session Management]
    end
```

### 1.1 Layer Descriptions
1. **Presentation Layer (React Server Components):** Utilizes Next.js Server Components to render HTML on the server before sending it to the client. This reduces the JavaScript bundle size sent to the browser, improving performance and SEO.
2. **Application Logic Layer (API Routes):** Instead of a separate Express.js or Python backend, the backend logic is co-located within the Next.js `src/app/api` directory. These serverless functions handle form submissions, session validation, and business logic (like checking for duplicate registrations).
3. **Data Layer (Supabase/PostgreSQL):** A fully managed PostgreSQL database handles persistent storage. It provides strict relational integrity through foreign keys and constraints.

---

## 2. Database Design & Entity-Relationship Model

The data layer is rigorously structured to ensure normalization (Third Normal Form - 3NF) where possible, eliminating redundant data and ensuring referential integrity.

### 2.1 Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USERS {
        uuid id PK "Primary Key, auto-generated UUID"
        string email "Unique, required"
        string password_hash "SHA-256 hashed string"
        string name "User's full name"
        string role "Enum: STUDENT, ORGANIZER, ADMIN"
        timestamp created_at "Default: NOW()"
    }
    
    EVENTS {
        uuid id PK "Primary Key, auto-generated UUID"
        string title "Event Name"
        text description "Detailed description"
        timestamp event_date "Scheduled date and time"
        string location "Physical or virtual location"
        uuid organizer_id FK "References USERS(id)"
        string status "Enum: UPCOMING, ONGOING, COMPLETED"
        timestamp created_at "Default: NOW()"
    }
    
    REGISTRATIONS {
        uuid id PK "Primary Key, auto-generated UUID"
        uuid event_id FK "References EVENTS(id)"
        uuid student_id FK "References USERS(id)"
        timestamp registered_at "Default: NOW()"
    }
    
    USERS ||--o{ EVENTS : "An ORGANIZER creates (0 to N) EVENTS"
    USERS ||--o{ REGISTRATIONS : "A STUDENT submits (0 to N) REGISTRATIONS"
    EVENTS ||--o{ REGISTRATIONS : "An EVENT receives (0 to N) REGISTRATIONS"
```

### 2.2 Schema Implementation Notes
- **UUIDs:** Universally Unique Identifiers are used as primary keys instead of auto-incrementing integers to prevent ID-guessing attacks and facilitate easier data merging if the system becomes distributed.
- **Foreign Key Constraints:** `event_id` and `student_id` in the `REGISTRATIONS` table strictly reference their parent tables. Attempting to register a non-existent student or for a deleted event will result in a database-level rejection.

---

## 3. Critical System Workflows

Understanding the flow of data during critical operations is essential for debugging and future feature expansion.

### 3.1 Authentication Workflow (Login)
The authentication system relies on custom session management rather than external OAuth providers, ensuring total data sovereignty.

```mermaid
sequenceDiagram
    actor User
    participant Browser as Client Browser
    participant API as Next.js (/api/auth/login)
    participant DB as Supabase PostgreSQL

    User->>Browser: Submits Email & Password
    Browser->>API: POST JSON payload {email, password}
    
    API->>API: Hash provided password (SHA-256)
    API->>DB: SELECT * FROM users WHERE email = ?
    
    alt User Not Found
        DB-->>API: Returns null
        API-->>Browser: 401 Unauthorized ("User not found")
    else User Found
        DB-->>API: Returns User Record (including password_hash)
        API->>API: Compare generated hash with database hash
        
        alt Hashes Match
            API->>API: Generate Session Object & Set-Cookie Header
            API-->>Browser: 200 OK + HTTP-Only Cookie + JSON Redirect URL
            Browser->>Browser: Update localStorage & Dispatch Event
            Browser->>User: Redirects to appropriate Dashboard
        else Hashes Do Not Match
            API-->>Browser: 401 Unauthorized ("Invalid password")
        end
    end
```

### 3.2 Safe Registration Workflow (Duplicate Prevention)
The core business logic of the student portal ensures data integrity by preventing a single student from registering for the same event multiple times.

```mermaid
sequenceDiagram
    actor Student
    participant UI as React Registration Form
    participant API as Next.js API (/api/events/[id]/register)
    participant DB as Database

    Student->>UI: Selects Event from Dropdown
    UI->>UI: Check local `registeredEvents` array
    
    alt Event ID found in local array
        UI->>UI: Disable Submit Button
        UI-->>Student: Display "Already Registered" UI state
    else Event ID not found
        Student->>UI: Clicks "Register"
        UI->>API: POST Request with Event ID
        
        API->>DB: Validate Session Cookie -> Get Student ID
        API->>DB: Query REGISTRATIONS WHERE student_id = ? AND event_id = ?
        
        alt Record Exists (Race Condition Guard)
            DB-->>API: Row found
            API-->>UI: 400 Bad Request ("Already registered")
        else No Record Exists
            API->>DB: INSERT INTO REGISTRATIONS
            DB-->>API: Success Response
            API-->>UI: 200 OK
            UI->>UI: Trigger UI Refresh & Lock Form
        end
    end
```
