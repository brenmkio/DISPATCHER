# Implementation Plan - Shipment Tracker

## Phase 1: Foundation (Current Task)

### 1.1 Type Definitions
- [ ] Create `Tickets_Schema` interface in `types.ts`
- [ ] Follow template's existing pattern for mirroring database types
- [ ] Export type for use across app

### 1.2 Supabase Client Setup
- [ ] Verify Supabase client initialization
- [ ] Add helper functions for ticket CRUD operations
- [ ] Test connection to `public."DISPATCHER_Tickets"` table

### 1.3 Auth Middleware
- [ ] Review existing `hooks.server.ts` implementation
- [ ] Ensure admin routes check for authenticated user
- [ ] Set up session handling
- [ ] Create helper to get current user in server routes

### 1.4 RLS Policies (SQL to run in Supabase)
```sql
-- Enable RLS
ALTER TABLE public."DISPATCHER_Tickets" ENABLE ROW LEVEL SECURITY;

-- Admin (authenticated) can do everything
CREATE POLICY "Admin full access"
ON public."DISPATCHER_Tickets"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Public can only read via UUID
CREATE POLICY "Public read by UUID"
ON public."DISPATCHER_Tickets"
FOR SELECT
TO anon
USING (true);
```

## Phase 2: Admin Routes

### 2.1 Admin Login (`/admin/login`)
- [ ] Create login page with email/password form
- [ ] Use Supabase Auth signInWithPassword
- [ ] Redirect to dashboard on success
- [ ] Display error messages on failure

### 2.2 Admin Dashboard (`/admin/dashboard`)
- [ ] Create protected route (check auth in `+page.server.ts`)
- [ ] Load all tickets from database
- [ ] Display tickets in table/card layout
- [ ] Show: client name, status, pickup/delivery locations, dates
- [ ] Add "Create New Ticket" button
- [ ] Add logout button
- [ ] Add click-through to ticket detail page

### 2.3 Create Ticket (`/admin/tickets/new`)
- [ ] Create form with all required fields
- [ ] Client name, email, pickup/delivery locations, item description
- [ ] Optional: estimated delivery date, notes
- [ ] Form validation (required fields, email format)
- [ ] Submit creates ticket in database
- [ ] Display generated tracking URL after creation
- [ ] Provide "Copy URL" button
- [ ] Redirect to ticket detail page

### 2.4 Edit Ticket (`/admin/tickets/[id]`)
- [ ] Load ticket by ID from database
- [ ] Show 404 if ticket doesn't exist
- [ ] Pre-populate form with existing data
- [ ] Allow editing all fields including status
- [ ] Save updates to database
- [ ] Show success message on save
- [ ] Display tracking URL with copy button

## Phase 3: Public Tracking

### 3.1 Track Page (`/track/[ticketId]`)
- [ ] Public route (no auth required)
- [ ] Load ticket by UUID from database
- [ ] Show 404 if ticket doesn't exist or invalid UUID
- [ ] Display read-only ticket information:
  - Client name
  - Pickup and delivery locations
  - Item description
  - Current status (styled/colored badge)
  - Estimated delivery date
  - Notes (if any)
- [ ] Clean, minimal layout
- [ ] No edit capabilities

## Phase 4: Polish & Testing

### 4.1 UI Improvements
- [ ] Consistent Tailwind styling across pages
- [ ] Status badges with colors (pending=yellow, in_transit=blue, delivered=green)
- [ ] Form error states and validation messages
- [ ] Loading states for async operations
- [ ] Empty states (no tickets, etc.)

### 4.2 Error Handling
- [ ] Database connection errors
- [ ] Invalid ticket IDs
- [ ] Auth failures
- [ ] Form validation errors

### 4.3 Testing Checklist
- [ ] Can create ticket with all fields
- [ ] Can create ticket with only required fields
- [ ] Generated tracking URL works
- [ ] Can update ticket status
- [ ] Can edit all ticket fields
- [ ] Public page shows correct data
- [ ] Invalid URLs show 404
- [ ] Login required for admin routes
- [ ] Logout works correctly

## Development Notes

### File Organization
```
src/
├── lib/
│   ├── types.ts              # Add Tickets_Schema here
│   ├── server/
│   │   └── supabase.ts       # Supabase client setup
│   └── components/
│       ├── TicketForm.svelte
│       ├── TicketList.svelte
│       └── StatusBadge.svelte
├── routes/
│   ├── admin/
│   │   ├── login/
│   │   │   └── +page.svelte
│   │   ├── dashboard/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   └── tickets/
│   │       ├── new/
│   │       │   ├── +page.svelte
│   │       │   └── +page.server.ts
│   │       └── [id]/
│   │           ├── +page.svelte
│   │           └── +page.server.ts
│   └── track/
│       └── [ticketId]/
│           ├── +page.svelte
│           └── +page.server.ts
└── hooks.server.ts           # Already set up - use for auth
```

### Key Patterns from Template
- Use existing `hooks.server.ts` for auth checks
- Follow `*_Schema` naming in `types.ts` to mirror DB tables
- Server-side data loading in `+page.server.ts`
- Form actions for mutations

### Next Steps After Foundation
Once types, auth, and RLS are in place:
1. Build admin login
2. Build dashboard with ticket list
3. Build ticket creation form
4. Build ticket edit page
5. Build public tracking page
6. Test end-to-end flows