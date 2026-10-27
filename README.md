# AuraLMS — Enterprise High-Craft MERN Learning Management System

> Built with the **MERN Stack** (MongoDB, Express, React + Vite, Node.js) and adhering strictly to the **UI Design Intelligence & Anti-Slop Specification** (`DESIGN.md`, `make-interfaces-feel-better`, `ui-ux-pro-max`, `design-taste-frontend`).

---

## 1. System Architecture & Features

### Core Stack & App Architecture
- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Context API, Lucide Icons, Framer Motion.
- **PWA & Native App Engine**:
  - Web App Manifest (`/manifest.json`) supporting standalone display on Windows, macOS, Android, and iOS.
  - Native Launch **Splash Screen** with brand aura pulse and progress telemetry.
  - **1-Click App Installation**: Custom install prompt hooking into `beforeinstallprompt` with native desktop & mobile guidance.
  - **Fixed App Bottom Navigation Bar** on mobile viewports with tactile active tab feedback (`scale(0.96)`).
  - Service Worker (`/sw.js`) with shell asset caching.
- **Backend**: Node.js, Express.js, MongoDB via Mongoose.
- **Zero-Config Database**: Cloud MongoDB Atlas integration with automatic auto-seed readiness.

### Native App Student Experience
- **Interactive App Home Feed**: Replaces traditional static marketing websites with an active user dashboard, time-aware greeting, 5-day learning streak tracker, 1-click "Resume Lesson" hero card, and horizontal category chips.
- **Strict Role-Gated Access**: Public catalog displays course metadata and public topic outlines. Protected lesson videos, notes, and attached resources are strictly restricted behind backend authorization.
- **Student Dashboard**: Only lists courses the student has an active `CourseAccess` grant for. Displays progress bars, completed lesson counters, and recent activity.
- **Honest Empty State**: When a newly registered student has zero courses granted, clear guidance explains that administrative enrollment approval is required.
- **Interactive Classroom**:
  - Structured **Course → Topics/Modules → Lessons** hierarchy.
  - Video player supporting YouTube, Vimeo, Wistia, Google Drive, and No-Video practical reading modules.
  - Multiple attached resources: Google Drive PDFs, Google Docs, Sheets, Slides, external HTTPS links, downloadable PDFs.
  - In-app sandboxed preview modal for document reading.
  - Rich Markdown notes with code blocks and one-click copy.
  - Previous / Next lesson navigation and "Mark as Completed" progress toggle.

### Administrative Governance
- **Administrative Console**: Metrics overview (Total Courses, Active Students, Enrollment Grants, Completion counts).
- **Course CRUD & 1-Click Publishing**: Instant toggle between draft and published status.
- **Curriculum Builder**:
  - Create and reorder modules/topics.
  - Add and configure lessons with live URL validation for YouTube, Vimeo, Wistia, and Google Drive.
  - Attach multiple resources with type-specific indicators and download toggles.
- **Student Access Governance**:
  - View all registered students.
  - Individually grant or revoke access per course with live progress feedback.
  - Registration **never** grants course access automatically.

---

## 2. Critical Access Control & Security Architecture

1. **HTTP-Only JWT Authentication**: Tokens are issued inside `httpOnly: true`, `secure: true` (in production), and `sameSite: 'lax'` cookies.
2. **Strict Backend IDOR Protection**: The `checkCourseAccess` middleware intercepts every learning request (`/api/courses/:slug/lessons/:lessonId`, `/progress`, `/curriculum`). It checks `CourseAccess` status and expiration before sending protected lesson streams or resources.
3. **Mass-Assignment Defense**: The registration endpoint strictly overrides incoming fields to guarantee `role: 'student'` and `status: 'active'`. Admin roles cannot be acquired through self-registration.
4. **Safe Sandboxed Embeds**: Raw `<iframe ...>` HTML strings are strictly blocked to eliminate Cross-Site Scripting (XSS). Canonical provider IDs are parsed, and safe, sandboxed embed URLs are constructed.
5. **Third-Party Permissions Notice**: Hiding or embedding a URL in the LMS does not alter the underlying source's permissions. Google Drive files or external links must have appropriate sharing permissions granted at the provider level.

---

## 3. Administrator Onboarding

AuraLMS features zero-credential initial setup:
- On a fresh deployment with an empty database, the **first user who registers via the `/register` portal is automatically granted Master Administrator privileges**.
- Subsequent registrations receive standard Student accounts.
- Administrators can grant or revoke course access through the dedicated `/admin/students` management panel.

---

## 4. Getting Started & Running Locally

### Step 1: Install Dependencies
```bash
# Install root, server, and client packages
npm install
npm --prefix server install
npm --prefix client install
```

### Step 2: Seed the Database
```bash
# Runs the seed script (seeds admin, demo students, courses, topics, lessons, resources)
npm run seed
```

### Step 3: Start Development Servers
```bash
# Starts both Express API (:5000) and React Vite (:5173) concurrently
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 5. Environment Variables (`server/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/auralms
JWT_SECRET=super_secret_jwt_key_auralms_production_grade_32bytes_min
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@auralms.com
ADMIN_PASSWORD=AdminPass123!
```

*Note: If `mongodb://127.0.0.1:27017` is not running locally, the server automatically starts an in-memory MongoDB instance for instant zero-configuration development.*
