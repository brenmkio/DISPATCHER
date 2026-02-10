# DISPATCHER Domain

## Purpose
This domain handles ticket management and dispatch operations.

## Architecture
- **DAL**: Direct database operations on DISPATCHER_Tickets table
- **SERVICE**: Business logic for ticket operations and connection testing
- **UTILS**: Ticket formatting and validation utilities

## Key Functions
- `DAL_get_one_ticket()`: Fetches a single ticket from database
- `DISPATCHERSERVICE_test_connection()`: Tests database connection via ticket fetch
- `DISPATCHERUTIL_format_ticket_for_display()`: Formats ticket for UI display

## Error Handling
All functions use App_Error pattern with proper layer attribution and context accumulation.
