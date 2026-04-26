# Campus Event Hub (CEH)

![CEH Banner](https://img.shields.io/badge/Status-Active_Development-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)

Campus Event Hub (CEH) is a modern, full-stack web application designed to solve the fragmentation of university event management. Built natively on the **Next.js App Router** and powered by a highly relational **Supabase PostgreSQL** backend, CEH provides an elegant, centralized platform where Organizers can seamlessly publish events, Students can reliably register, and Administrators can monitor platform integrity.

---

## Core Features & Capabilities

### 1. Robust Role-Based Access Control (RBAC)
The platform routes and restricts users based on three rigid roles:
- **Students**: Can view active events and submit registrations.
- **Organizers**: Can create new events, view their specific authored events, and track live registration counts and attendee lists.
- **Administrators**: Have global read/write privileges, overseeing all platform data and enforcing university moderation policies.

### 2. State-of-the-Art User Interface
- **Dynamic Particle Engine:** The public landing pages feature a custom-built HTML5 Canvas particle animation (`DotAnimation`), providing a premium, interactive visual experience.
- **Glassmorphism:** The application heavily utilizes Tailwind's `backdrop-blur` utilities to create deeply translucent, frosted-glass components that interact beautifully with the animated backgrounds.

### 3. Bulletproof Data Integrity
- **Duplicate Registration Prevention:** Complex server-side API logic and responsive client-side UI work in tandem to prevent a student from registering for an event multiple times.
- **Secure Authentication:** Passwords are cryptographically hashed using SHA-256 prior to database storage, and session state is managed via secure HTTP-only cookies.

---

## Technical Stack Architecture

- **Frontend Framework:** Next.js (React Server Components + Client Components)
- **Styling:** Tailwind CSS
- **Backend API:** Next.js API Routes (Serverless Functions)
- **Database:** Supabase (PostgreSQL 14+)
- **Testing Capabilities:** Designed for integration with Jest and Cypress.

---

## Complete Local Development Setup

To run this project on your local machine for development or grading purposes, follow these exhaustive steps.

### Step 1: Clone and Install
First, clone the repository to your local machine and install the Node.js dependencies.
```bash
git clone https://github.com/your-username/campus-event-hub.git
cd campus-event-hub
npm install
```

### Step 2: Environmental Configuration
The application requires connection strings to interface with the database. Create a file named `.env.local` in the root directory of the project.
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*(Contact the repository owner if you require access to the staging database credentials).*

### Step 3: Database Provisioning (Supabase)
If you are setting up a fresh database instance:
1. Log in to your Supabase project.
2. Navigate to the SQL Editor.
3. Open the `supabase_schema.sql` file provided in this repository.
4. Copy the raw SQL and execute it within Supabase to automatically provision the necessary `users`, `events`, and `registrations` tables along with their foreign key constraints.

### Step 4: Boot the Application
Start the Next.js development server.
```bash
npm run dev
```
The application will compile. Once finished, open your browser and navigate to `http://localhost:3000`.

---

## Documentation Directory

For deep technical insights, testing matrices, and operational guidelines, please refer to the `docs/` folder in this repository:

1. `docs/SRS.md` - Software Requirements Specification outlining scope and functional limits.
2. `docs/Architecture.md` - High-level system design and Mermaid ER/Sequence diagrams.
3. `docs/Test_Reports.md` - Execution reports for Unit, API Integration, and End-to-End tests.
4. `docs/Deployment_Guide.md` - DevOps manual for deploying to Vercel and provisioning Supabase.
5. `docs/User_Manual.md` - End-user onboarding guide and feature walkthrough.
