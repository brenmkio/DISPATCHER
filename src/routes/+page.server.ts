
import { handle_error } from '$lib/EXAMPLE_CORE/errors'
import { DSERVICE_get_all_tickets } from '$lib/DISPATCHER/service'

export const load = async ({ locals }) => {
	try {
		const tickets = await DSERVICE_get_all_tickets(locals.sb, 5)

		return {
			message: tickets.length > 0 ? 'Database connected successfully!' : 'Connected, but no tickets found.',
			tickets,
			error: null
		}
	} catch (e) {
		const app_error = handle_error(e, 'LOAD', 'database_connection_test', {
			operation: 'page_load'
		})

		return {
			message: 'Database connection failed',
			error: app_error,
			tickets: []
		}
	}
}
