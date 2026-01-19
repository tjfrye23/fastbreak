# Fastbreak Event Dashboard - Development Checklist

## Phase 1: Infrastructure & Setup

- [ ] Set up Supabase project and obtain credentials
- [ ] Create environment variables file (.env.local) with Supabase keys
- [ ] Design and implement database schema (events, venues, events_venues, profiles)
- [ ] Set up Row Level Security (RLS) policies for user-owned events
- [ ] Configure Supabase client with SSR support (lib/supabase/server.ts, middleware.ts)
- [ ] Set up Google OAuth in Supabase dashboard

## Phase 2: Authentication

- [ ] Create authentication UI (login page with email and Google options)
- [ ] Create signup page with email/password registration
- [ ] Implement authentication middleware for protected routes
- [ ] Implement logout functionality

## Phase 3: Server Actions Foundation

- [ ] Create Server Actions helper utilities (lib/actions/utils.ts) for type safety and error handling
- [ ] Create Server Action to fetch all events for authenticated user
- [ ] Create venues management Server Actions (CRUD)
- [ ] Create Server Action to create event with venues (with ownership tracking)
- [ ] Create Server Action to update event and venues
- [ ] Create Server Action to delete event (with ownership check)

## Phase 4: Dashboard & Event List

- [ ] Build dashboard layout with navigation and logout button
- [ ] Build event list component with responsive grid/list layout
- [ ] Implement search functionality (refetch from database)
- [ ] Implement sport type filter (refetch from database)

## Phase 5: Event Management Forms

- [ ] Build create event form with shadcn/ui Form and react-hook-form
- [ ] Implement dynamic venue selection with add/remove functionality
- [ ] Build edit event page with pre-populated form data
- [ ] Implement ownership validation (users can only edit their own events)
- [ ] Implement delete event functionality with confirmation dialog

## Phase 6: UX Enhancements

- [ ] Add loading states to all async operations (Suspense boundaries)
- [ ] Implement error handling across all Server Actions
- [ ] Add toast notifications (Sonner) for success and error states

## Phase 7: Testing

- [ ] Test authentication flow (signup, login, logout, OAuth)
- [ ] Test event CRUD operations end-to-end
- [ ] Test ownership restrictions (ensure users can't edit others' events)
- [ ] Test search and filter functionality
- [ ] Verify responsive design on mobile and desktop
- [ ] Run build locally to check for errors

## Phase 8: Deployment

- [ ] Deploy to Vercel
- [ ] Configure environment variables in Vercel
- [ ] Test deployed application on production

---

## Database Schema

### Tables

**profiles**
- id (uuid, references auth.users)
- email (text)
- created_at (timestamp)

**events**
- id (uuid, primary key)
- user_id (uuid, references profiles.id)
- name (text)
- sport_type (text)
- date_time (timestamp)
- description (text)
- created_at (timestamp)
- updated_at (timestamp)

**venues**
- id (uuid, primary key)
- name (text)
- address (text) - optional
- created_at (timestamp)

**events_venues** (junction table)
- event_id (uuid, references events.id)
- venue_id (uuid, references venues.id)
- primary key (event_id, venue_id)

### RLS Policies

- Users can only edit/delete their own events
- Users can view all events
- Venues can be viewed by all authenticated users
- Junction table follows event ownership rules

---

## Key Technical Constraints

1. **All database operations MUST be server-side** (Server Actions, Server Components, or Route Handlers)
2. **NO direct Supabase calls from client components**
3. **Use shadcn/ui Form + react-hook-form for ALL forms**
4. **Prefer Server Actions over API Routes**
5. **Include loading states and error handling everywhere**
6. **Use toast notifications (Sonner) for user feedback**
