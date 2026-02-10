import type { Dispatcher_Tickets_Schema } from './types'
import type { App_Error } from '$lib/EXAMPLE_CORE/types'

export function DUTIL_format_ticket_for_display(
	ticket: Dispatcher_Tickets_Schema
): string {
	return JSON.stringify(ticket, null, 2)
}

export function DUTIL_is_ticket_valid(
	ticket: Partial<Dispatcher_Tickets_Schema>
): boolean {
	return !!(
		ticket &&
		ticket.client_name &&
		ticket.client_email &&
		ticket.pickup_location &&
		ticket.delivery_location &&
		ticket.item_description
	)
}

export function DUTIL_format_error_for_display(
	error: App_Error
): { summary: string; details: string; troubleshooting: string[] } {
	const latest_frame = error.frames[error.frames.length - 1]
	const troubleshooting = latest_frame.context?.troubleshooting || []

	const error_frames = error.frames.map(frame =>
		`[${frame.layer}] ${frame.code}: ${frame.message}`
	).join('\n')

	return {
		summary: latest_frame.message || 'An unexpected error occurred',
		details: error_frames,
		troubleshooting
	}
}
