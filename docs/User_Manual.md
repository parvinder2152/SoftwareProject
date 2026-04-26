# Campus Event Hub (CEH) - Comprehensive User Manual

Welcome to the Campus Event Hub! This platform is designed to make organizing, finding, and attending university events as seamless as possible. This manual provides a detailed walkthrough of the system’s features, categorized by user role.

---

## 1. System Overview & Onboarding

### 1.1 Accessing the Platform
To access the platform, open your preferred web browser (Google Chrome, Safari, or Mozilla Firefox are recommended) and navigate to the Campus Event Hub URL. 
You will be greeted by the **Landing Page**, featuring a dynamic visual background and a summary of upcoming highlights. 

### 1.2 Account Creation
1. Click the **"Sign In"** button located in the top-right corner of the navigation bar, or click the **"Sign in to register"** button on the landing page.
2. If you do not have an account, click the **"Create an account"** link at the bottom of the sign-in form.
3. Fill in your **Full Name**, **University Email**, and a secure **Password**.
4. Click **"Create account"**. 
*Note: By default, all new accounts created through the public interface are assigned the `STUDENT` role.*

### 1.3 Logging In
1. Navigate to the **Sign In** page.
2. Enter your registered email and password.
3. Click **"Sign In"**. 
4. The system will securely authenticate you and automatically redirect you to the appropriate dashboard based on your assigned role (Student, Organizer, or Admin).

---

## 2. The Student Portal

The Student Portal is the default view for the general student body. It is designed for discovery and rapid registration.

### 2.1 Navigating the Dashboard
Upon logging in, you will see your Student Dashboard. 
- The top header will greet you by name and display your current active role.
- The main interface consists of the **"Reserve your place"** registration form.

### 2.2 Registering for an Event
1. Click the **"Select an event"** dropdown menu.
2. You will see a list of all currently active events organized on campus.
3. Select the event you wish to attend. 
4. Click the blue **"Register"** button.
5. The system will process your request, and the form will reset.

### 2.3 Managing Registrations and Preventing Duplicates
CEH has strict safeguards to prevent accidental duplicate registrations.
- If you open the event dropdown, any event you have successfully registered for will have the tag **`(Registered)`** appended to its title.
- If you select an event marked as `(Registered)`, the system will automatically **disable** the "Register" button and change its text to read **"Already Registered"**, preventing you from submitting the form again.

---

## 3. The Organizer Portal

The Organizer Portal provides tools for faculty, club leaders, and event coordinators to manage logistics.

### 3.1 Creating a New Event
On the right side of the Organizer dashboard, you will find the **Create Event** panel.
1. **Title:** Enter a clear, concise name for your event (e.g., "Spring Tech Symposium").
2. **Date & Time:** Use the standardized HTML date-time picker. Ensure you select the correct AM/PM values.
3. **Location:** Specify the physical room number or the virtual meeting link.
4. **Description:** Provide a detailed agenda or requirements for attendees.
5. **Submit:** Click **"Create Event"**. The system will immediately publish it to the student portal and update your dashboard.

### 3.2 Monitoring Registration Analytics
On the left side of the Organizer dashboard, you will see a list of **"Your Events"**.
- This list *only* shows events that you have personally created.
- Each event card displays real-time statistics, including the **Current Registration Count**.
- Click the **"Open"** button on any event card to access the Administration View. This view provides a detailed, live-updating list of the names and emails of every student who has RSVP'd to your specific event.

---

## 4. The Administrator Portal

The Admin portal is a restricted area reserved for high-level university staff.

### 4.1 Global Event Visibility
Unlike Organizers, who can only see their own events, the Administrator Dashboard displays **every single event** created across the entire university network, regardless of the author.

### 4.2 Moderation Capabilities
Admins act as the final authority on platform content. 
- Admins can review all event descriptions and details for compliance with university policy.
- Admins possess the ability to flag, modify, or completely delete events from the database if they are deemed inappropriate or erroneous.

---

## 5. Troubleshooting & FAQ

**Q: I forgot my password, how do I reset it?**
A: Currently, password resets must be handled manually by a System Administrator. Please contact university IT support.

**Q: I registered for an event by mistake. Can I un-register?**
A: The current iteration of CEH does not support student self-service cancellation. Please contact the Event Organizer listed on the event page to have them manually remove you from the roster.

**Q: The page isn't updating with the latest event numbers!**
A: Ensure you have a stable internet connection. CEH uses real-time fetching, but if your browser loses connection, you may need to manually refresh the page (F5 or Ctrl+R) to pull the latest numbers from the database.
