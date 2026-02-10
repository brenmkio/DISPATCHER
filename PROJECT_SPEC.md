# Shipment Tracker - Project Specification

## Problem Statement
Dispatcher (Mark) needs a way for clients to track their shipments without constant phone/email updates. Currently operates on trust basis - follows up with drivers manually, relays ETAs to clients. Wants automated, transparent tracking.

## Solution
Web app where Mark creates shipment tickets, generates unique tracking URLs, and shares them with clients. Clients see real-time status updates. Mark maintains full control as admin.

## User Personas

### Primary User: Mark (Admin/Dispatcher)
- Creates shipment tickets when clients request delivery
- Monitors multiple active shipments
- Updates status as shipment progresses (pending → in transit → delivered)
- Needs quick overview of all active and completed tickets

### Secondary User: Client (Customer)
- Receives tracking URL from Mark
- Views shipment status without logging in
- Sees delivery estimates and updates
- Read-only access - cannot modify anything

## Core User Flows

### Flow 1: Creating a Shipment
1. Mark logs into admin dashboard
2. Clicks "Create New Ticket"
3. Enters shipment details (client info, addresses, item description, estimated delivery)
4. Submits form
5. System generates unique tracking URL
6. Mark copies URL and sends to client via email/text

### Flow 2: Client Tracking
1. Client receives tracking URL from Mark
2. Opens URL in browser
3. Sees shipment details and current status
4. Can refresh page for updates (no login required)

### Flow 3: Updating Shipment Status
1. Mark opens ticket in admin panel
2. Changes status dropdown (e.g., "Pending" → "In Transit")
3. Updates actual dates if needed
4. Saves changes
5. Client sees updated status when they refresh tracking page

### Flow 4: Admin Dashboard Overview
1. Mark logs into admin panel
2. Sees list of all tickets with key info (client, status, dates)
3. Can filter by status (show only in-transit, etc.)
4. Clicks ticket to view/edit details

## Data Model

### Ticket Entity
Represents a single shipment from pickup to delivery.

**Fields:**
- `id`: Unique identifier (UUID)
- `created_at`: When ticket was created
- `status`: Current shipment status (pending/in_transit/delivered/cancelled)
- `client_name`: Customer name
- `client_email`: Customer contact
- `pickup_location`: Origin address
- `delivery_location`: Destination address
- `item_description`: What's being shipped
- `estimated_delivery`: Estimated delivery date
- `notes`: Additional information/instructions

## Feature Requirements

### Must Have (Demo Scope)
- ✅ Admin authentication (login/logout)
- ✅ Create new shipment ticket
- ✅ Generate unique tracking URL
- ✅ Public tracking page (read-only)
- ✅ Update ticket status
- ✅ View all tickets in admin dashboard
- ✅ Edit ticket details
- ✅ Basic form validation

### Should Have (Future)
- Email notifications on status change
- PDF proof of delivery certificates
- Invoice generation
- Multiple stakeholder contacts
- Fee calculations (broker, cancellation, late pickup)
- File uploads for delivery confirmation
- Search/filter tickets by date, client, status

### Could Have (Nice to Have)
- Real-time updates (WebSocket)
- SMS notifications
- Driver mobile app for status updates
- Analytics dashboard
- Export to CSV
- Client portal with all their shipments

## Technical Requirements

### Performance
- Page load < 2s on standard connection
- Handle 100+ tickets in dashboard without lag

### Security
- Admin routes require authentication
- Public routes accessible via UUID only (not enumerable)
- Row-level security on database
- No sensitive data exposed in public URLs

### Accessibility
- Keyboard navigation for forms
- Clear error messages
- Readable font sizes and contrast

## Success Criteria for Demo
1. Mark can create a ticket and receive a tracking URL
2. Client can open URL and see shipment details
3. Mark can update status, client sees change on refresh
4. Admin dashboard shows all tickets with filtering
5. Authentication works (admin can login/logout)
6. Forms validate input properly
7. App is deployed and accessible via Vercel URL

## Non-Goals for Demo
- Production-ready error handling
- Comprehensive test coverage
- Advanced UI polish
- Mobile optimization
- Email/SMS integration
- Multi-user admin access
- Historical audit logs