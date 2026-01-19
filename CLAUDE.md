# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fastbreak is a full-stack Sports Event Management application built as a Udacity challenge. Users can create, view, and manage sports events with venue information.

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Database:** Supabase
- **Authentication:** Supabase Auth (Email and Google OAuth)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Forms:** react-hook-form with shadcn/ui Form component
- **Deployment:** Vercel

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Guidelines

### Data Fetching & Mutations

**Critical:** All database interactions MUST be server-side only:
- Use Server Actions (preferred)
- Use Server Components
- Use Route Handlers only if absolutely necessary
- **Never** make direct Supabase client calls from client components

**Server Actions:**
- Prefer Server Actions over API Routes
- Create generic helpers that ensure:
  - Strong type safety
  - Consistent error handling
- All server actions should be in `lib/actions/` directory

### Authentication

- Protected routes must redirect unauthenticated users to login
- Authentication handled via Supabase Auth
- Support both email/password and Google OAuth

### UI/UX Standards

- **All UI components** must use shadcn/ui
- **All forms** must use:
  - shadcn/ui Form component
  - react-hook-form
  - See: https://ui.shadcn.com/docs/components/form
- Maintain consistent styling with Tailwind CSS
- Include loading states for all async operations
- Include error handling with user-friendly messages
- Use toast notifications (Sonner) for success and error states

### Data Model

Events have the following structure:
- Event name
- Sport type (e.g., Soccer, Basketball, Tennis)
- Date & time
- Description
- Venues (plural - multiple venues per event)

### Dashboard Features

The dashboard must support:
- List view of all sports events
- Search by event name (refetch from database)
- Filter by sport type (refetch from database)
- Responsive grid or list layout
- Navigation to create/edit forms

## File Organization

- `/app` - Next.js App Router pages and layouts
- `/components` - React components (shadcn/ui components in `/components/ui`)
- `/lib/supabase` - Supabase client configuration and middleware
- `/lib/actions` - Server Actions for database operations
