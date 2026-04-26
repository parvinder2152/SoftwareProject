# Comprehensive Deployment & DevOps Guide

This document outlines the exact operational procedures required to take the Campus Event Hub (CEH) from a local development environment (`localhost`) to a globally available, production-ready state. The project utilizes a modern Serverless architecture, deploying the Next.js frontend and API routes to **Vercel**, and hosting the PostgreSQL database on **Supabase**.

---

## 1. Prerequisites and Environmental Setup

Before beginning the deployment process, ensure you have the following accounts and tools configured:
- **Git & GitHub:** The codebase must be tracked in a Git repository and pushed to a remote GitHub repository.
- **Node.js (v18+):** Required for local building and testing.
- **Vercel Account:** A free Hobby tier account on [vercel.com](https://vercel.com).
- **Supabase Account:** A free tier account on [supabase.com](https://supabase.com).

---

## 2. Database Provisioning (Supabase)

Supabase serves as our Backend-as-a-Service (BaaS), providing a managed PostgreSQL instance and an automatic RESTful API (PostgREST).

### Step 2.1: Project Creation
1. Log in to the Supabase Dashboard.
2. Click **"New Project"** and select your organization.
3. Name the project `Campus-Event-Hub`.
4. Generate a secure, complex database password and save it in a secure password manager.
5. Select a geographical region closest to your primary user base (e.g., US East) to minimize latency.
6. Click **"Create new project"**. Provisioning will take approximately 1-3 minutes.

### Step 2.2: Schema Initialization
1. Once the project is active, navigate to the **SQL Editor** via the left-hand sidebar menu.
2. Click **"New Query"**.
3. Locate the `supabase_schema.sql` file in your project's artifact or root directory. Copy the entire contents.
4. Paste the SQL script into the Supabase editor and click **"RUN"**.
5. *Verification:* Navigate to the **Table Editor** to confirm the creation of the `users`, `events`, and `registrations` tables.

### Step 2.3: Retrieve Environment Keys
1. In the Supabase Dashboard, navigate to **Project Settings** (the gear icon) -> **API**.
2. Locate the **Project URL**. This is your `NEXT_PUBLIC_SUPABASE_URL`.
3. Locate the **Project API Keys** and copy the `anon` `public` key. This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
*(Note: Do not expose the `service_role` secret key. It has root access to the database).*

---

## 3. Application Deployment (Vercel)

Vercel provides zero-configuration deployments for Next.js applications, automatically handling build steps, edge caching, and serverless function routing.

### Step 3.1: Repository Integration
1. Log in to your Vercel Dashboard.
2. Click the **"Add New..."** dropdown and select **"Project"**.
3. Under the "Import Git Repository" section, locate your GitHub repository containing the CEH codebase and click **"Import"**.

### Step 3.2: Build Configuration & Environment Variables
1. In the "Configure Project" screen, ensure the **Framework Preset** is automatically detected as `Next.js`.
2. Leave the Build and Output Settings as their defaults.
3. Expand the **Environment Variables** section. This is critical for connecting the Vercel serverless functions to your Supabase database.
4. Add the following key-value pairs exactly:
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL` | **Value:** *[Paste Project URL from Step 2.3]*
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Value:** *[Paste Anon Key from Step 2.3]*
5. Click the blue **"Deploy"** button.

### Step 3.3: The Build Process
Vercel will now execute the CI/CD pipeline:
1. **Cloning:** Fetching the latest commit from the `main` branch.
2. **Building:** Running `npm install` followed by `npm run build`. Next.js will compile React Server Components, optimize assets, and package API routes into AWS Lambda-based serverless functions.
3. **Deployment:** Distributing the static assets to the global Edge Network and provisioning the functions.

---

## 4. Post-Deployment & Continuous Integration

### 4.1 Live Verification
Once the Vercel build succeeds, you will be provided with a production URL (e.g., `https://campus-event-hub.vercel.app`).
1. Navigate to the URL.
2. Ensure the HTML5 Canvas background animation loads correctly.
3. Log in using a seeded demo account to verify that the Vercel Edge functions are successfully communicating with the Supabase database.

### 4.2 CI/CD Pipeline (Automated Deployments)
Because Vercel is integrated with your GitHub repository, **Continuous Deployment** is automatically enabled.
- Every time a developer pushes code to the `main` branch on GitHub, Vercel will intercept the web-hook, automatically trigger a new build, and update the production environment without any manual intervention.
- Pushes to other branches (e.g., `feature/ui-update`) will automatically generate **Preview Deployments**—temporary URLs where you can test the new code before merging it into production.
