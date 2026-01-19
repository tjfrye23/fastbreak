# 🏀 Fastbreak Event Dashboard

## 📌 Challenge Description
Build a full-stack **Sports Event Management** application where users can create, view, and manage sports events with venue information.

---

## 🛠️ Tech Stack & Requirements

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Database:** Supabase
- **Authentication:** Supabase Auth (Email and/or Google OAuth)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Deployment:** Vercel

---

## ✅ Core Requirements

### 🔐 Authentication
- Sign up / Login with:
  - Email & password
  - Google OAuth
- Protected routes (redirect unauthenticated users to login)
- Logout functionality

---

### 📊 Dashboard
After login, users should land on a dashboard that:

- Displays a list of all sports events
- Shows key event details:
  - Event name
  - Date
  - Venue
  - Sport type
- Allows navigation to:
  - Create event form
  - Edit event form
- Uses a responsive grid or list layout
- Supports:
  - Search by event name
  - Filter by sport type  
  *(Search and filters should refetch data from the database)*

---

### 🗓️ Event Management
Users should be able to:

- **Create events** with the following fields:
  - Event name
  - Sport type (e.g. Soccer, Basketball, Tennis)
  - Date & time
  - Description
  - Venues (plural)
- Edit existing events
- Delete events

---

## ⚙️ Technical Constraints & Guidelines

- All database interactions **must be server-side**
  - Server Actions
  - Server Components
  - Route Handlers (if absolutely necessary)
- ❌ No direct Supabase client calls from client components
- Prefer **Server Actions over API Routes**
  - Create generic helpers to ensure:
    - Strong type safety
    - Consistent error handling
- Use **shadcn/ui components throughout**
- Forms **must** use:
  - `shadcn/ui` Form component
  - `react-hook-form`  
  👉 https://ui.shadcn.com/docs/components/form
- Maintain consistent styling with Tailwind CSS
- Include loading states and error handling
- Display toast notifications for success and error states

---

## 🚀 Submission Requirements

- Deployed to **Vercel** (or another hosting platform)
- Public, working URL
- Code submitted via a **GitHub repository**

---

## ⏱️ Time Expectation
**2–3 hours**
