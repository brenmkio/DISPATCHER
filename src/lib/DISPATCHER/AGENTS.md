# DISPATCHER Domain

## Purpose
This domain handles shipment ticket management and dispatch operations.

## Architecture
- **DAL**: Direct database operations on DISPATCHER_Tickets table
- **SERVICE**: Business logic for ticket CRUD operations
- **UTILS**: Ticket formatting and validation utilities

## Key Functions

### DAL
- `DAL_get_all_tickets()`: Fetches all tickets with pagination
- `DAL_get_ticket_by_id()`: Fetches a single ticket by UUID
- `DAL_create_ticket()`: Creates a new ticket
- `DAL_update_ticket()`: Updates an existing ticket
- `DAL_delete_ticket()`: Deletes a ticket

### SERVICE
- `DSERVICE_get_all_tickets()`: Gets all tickets with error framing
- `DSERVICE_get_ticket_by_id()`: Gets a ticket by ID with error framing
- `DSERVICE_create_ticket()`: Creates a ticket with error framing
- `DSERVICE_update_ticket()`: Updates a ticket with error framing
- `DSERVICE_delete_ticket()`: Deletes a ticket with error framing

### UTILS
- `DUTIL_format_ticket_for_display()`: Formats ticket as JSON for display
- `DUTIL_is_ticket_valid()`: Validates required ticket fields
- `DUTIL_format_error_for_display()`: Formats App_Error for UI display

## Error Handling
All functions use App_Error pattern with proper layer attribution and context accumulation.
