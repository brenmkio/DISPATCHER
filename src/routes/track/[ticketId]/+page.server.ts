import { error } from '@sveltejs/kit'
import { handle_error } from '$lib/EXAMPLE_CORE/errors'
import { DSERVICE_get_ticket_by_id } from '$lib/DISPATCHER/service'

export const load = async ({ params, locals }) => {
	try {
		const ticket = await DSERVICE_get_ticket_by_id(locals.sb, params.ticketId)

		if (!ticket) {
			throw error(404, { message: 'Ticket not found' })
		}

		return {
			ticket
		}
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e) {
			throw e
		}
		const app_error = handle_error(e, 'LOAD', 'track_ticket_load_failed')
		throw error(500, { message: 'Failed to load tracking information' })
	}
}
