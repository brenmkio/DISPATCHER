import type { Dispatcher_Tickets_Schema } from './types'
import type { App_Error } from '$lib/EXAMPLE_CORE/types'

export function DISPATCHERUTIL_format_ticket_for_display(
	ticket: Dispatcher_Tickets_Schema
): string {
	return JSON.stringify(ticket, null, 2)
}

export function DISPATCHERUTIL_is_ticket_valid(
	ticket: Dispatcher_Tickets_Schema
): boolean {
	return !!(ticket && ticket.client_name && ticket.client_email)
}

export function DISPATCHERUTIL_format_error_for_display(
	error: App_Error
): { summary: string; details: string; troubleshooting: string[] } {
	const latest_frame = error.frames[error.frames.length - 1]
	const troubleshooting = latest_frame.context?.troubleshooting || []
	
	// Collect all error frames for detailed view
	const error_frames = error.frames.map(frame => 
		`[${frame.layer}] ${frame.code}: ${frame.message}`
	).join('\n')

	return {
		summary: latest_frame.message || 'An unexpected error occurred',
		details: error_frames,
		troubleshooting
	}
}
