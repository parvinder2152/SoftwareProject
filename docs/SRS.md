# Software Requirements Specification (SRS)
## Campus Event Hub (CEH)

---

## 1. Introduction

### 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) document is to provide a comprehensive and detailed description of the software requirements for the Campus Event Hub (CEH) system. This document is intended for project stakeholders, developers, software architects, and quality assurance engineers. It serves as the definitive source of truth for what the software is expected to do, outlining both functional capabilities and non-functional constraints.

### 1.2 Document Conventions
This document follows standard IEEE formatting for SRS documentation. 
- Requirements are uniquely identified using the `REQ-[CATEGORY]-[ID]` format for traceability.
- Priorities are defined implicitly; unless stated otherwise, all defined functional requirements are considered "Must Have" for the Minimum Viable Product (MVP).

### 1.3 Intended Audience and Reading Suggestions
This document is structured for multiple audiences:
- **Project Evaluators/Professors:** Focus on the overall description and functional requirements to understand project scope.
- **Software Developers:** Refer to the detailed functional requirements and system features for implementation details.
- **QA Testers:** Utilize the functional and non-functional requirements to draft comprehensive test cases.

### 1.4 Product Scope
The Campus Event Hub (CEH) is a modern, responsive web application designed to solve the problem of fragmented event communication within a university ecosystem. Currently, students rely on disjointed email threads, physical bulletin boards, and unstructured social media groups to find events. CEH centralizes this process. The system allows organizers to dynamically publish events, students to seamlessly register for them, and administrators to moderate the platform. The platform does *not* currently include integrated payment processing for paid events; all events are assumed to be free or handled externally.

---

## 2. Overall Description

### 2.1 Product Perspective
CEH is a standalone web application. It operates on a decoupled client-server architecture utilizing Next.js (App Router) as the full-stack framework and Supabase (a managed PostgreSQL service) as the persistent data storage layer. It is designed to be deployed on serverless infrastructure (like Vercel) for high availability and low latency.

### 2.2 Product Functions
A high-level summary of the major functions the software performs includes:
- **User Authentication & Authorization:** Secure registration, login, and session persistence using SHA-256 hashing and HTTP-only cookies.
- **Role Management:** Routing and access control based on three rigid roles: `STUDENT`, `ORGANIZER`, and `ADMIN`.
- **Event Lifecycle Management:** Creation, viewing, and deletion of campus events.
- **Registration Management:** One-click registration for students, duplicate registration prevention, and real-time attendee tracking for organizers.

### 2.3 User Classes and Characteristics
1. **Student:** The primary end-user. They are expected to be familiar with standard web interfaces. Their primary need is a fast, readable, and mobile-friendly interface to find and join events.
2. **Organizer:** Faculty members, club presidents, or student body representatives. They require a dashboard to manage their specific events and view registration metrics.
3. **Administrator:** System moderators (e.g., IT staff or university administration). They require global visibility over all events and the ability to intervene if an event violates university policy.

### 2.4 Operating Environment
- **Client Side:** The application must function on modern desktop web browsers (Chrome, Firefox, Safari, Edge) and mobile browsers (iOS Safari, Android Chrome).
- **Server Side:** Node.js runtime environment (specifically optimized for Vercel Serverless Functions).
- **Database:** PostgreSQL 14 or higher (managed via Supabase).

### 2.5 Design and Implementation Constraints
- **Framework Constraint:** The application must be built using Next.js and React.
- **Styling Constraint:** All styling must be implemented using Tailwind CSS.
- **Database Constraint:** Data must be modeled relationally within PostgreSQL; NoSQL solutions are not permitted for core entities.

---

## 3. System Features & Functional Requirements

### 3.1 User Authentication System
**Description:** The system must securely handle the onboarding and verification of users.
- **REQ-AUTH-01:** The system shall provide a registration interface requiring Full Name, University Email, and Password.
- **REQ-AUTH-02:** The system shall enforce uniqueness on the email field at the database level to prevent duplicate accounts.
- **REQ-AUTH-03:** Passwords shall be hashed using SHA-256 before being stored in the database. Plain text passwords must never touch the database.
- **REQ-AUTH-04:** Upon successful login, the system shall generate a secure session payload and store it in an HTTP-only browser cookie (`ceh-session`) and synchronize minimal state to `localStorage` for client-side UI rendering.

### 3.2 Event Management (Organizer Portal)
**Description:** Capabilities provided to users with the `ORGANIZER` role.
- **REQ-EVT-01:** Organizers shall access a dedicated dashboard displaying only the events they have authored.
- **REQ-EVT-02:** The system shall provide a form to create events, capturing: Title, Description, Date/Time string, and Location.
- **REQ-EVT-03:** The system shall dynamically calculate and display the total number of registrations for each event authored by the organizer.
- **REQ-EVT-04:** Organizers shall be able to click an "Open" button on their event to view a detailed breakdown of all registered students.

### 3.3 Event Registration (Student Portal)
**Description:** The core workflow for the general student body.
- **REQ-REG-01:** Students shall view a list of all upcoming events fetched directly from the database.
- **REQ-REG-02:** The student dashboard must fetch the student's existing registration history upon page load.
- **REQ-REG-03:** The event registration dropdown must append `(Registered)` to the title of any event the student has already joined.
- **REQ-REG-04:** The system shall explicitly prevent duplicate registrations. If a student selects an event they are already registered for, the submit button must be disabled, and the UI must display an "Already Registered" warning.
- **REQ-REG-05:** If a duplicate registration bypasses the UI (e.g., via direct API call), the backend API must reject the request with a `400 Bad Request` status.

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
- **NFR-PERF-01:** The application must utilize Next.js Server-Side Rendering (SSR) or Static Site Generation (SSG) where appropriate to ensure initial page load times under 2 seconds.
- **NFR-PERF-02:** Dashboard views that require real-time data accuracy (e.g., organizer registration counts) must utilize `force-dynamic` to bypass aggressive caching.

### 4.2 Security Requirements
- **NFR-SEC-01:** Protection against SQL Injection. All database queries must be executed using parameterized queries or a secure ORM/Query Builder.
- **NFR-SEC-02:** Cross-Site Scripting (XSS) prevention. The React frontend must inherently sanitize all user inputs before rendering them to the DOM.

### 4.3 UI/UX and Aesthetics
- **NFR-UI-01:** The application must utilize a modern, premium aesthetic. This includes the use of dynamic HTML5 Canvas particle animations in the background and glassmorphic (frosted glass) translucent containers for primary interface elements.
- **NFR-UI-02:** The interface must be fully responsive, gracefully degrading from a multi-column layout on desktop to a stacked, single-column layout on mobile devices.
