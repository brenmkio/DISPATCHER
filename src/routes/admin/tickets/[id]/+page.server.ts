import { error, fail, type Actions } from '@sveltejs/kit'
import { handle_error } from '$lib/EXAMPLE_CORE/errors'
import { DSERVICE_get_ticket_by_id, DSERVICE_update_ticket } from '$lib/DISPATCHER/service'

export const load = async ({ params, locals }) => {
	try {
		const ticket_id = params.id as string
		const ticket = await DSERVICE_get_ticket_by_id(locals.sb, ticket_id)

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
		const app_error = handle_error(e, 'LOAD', 'ticket_detail_load_failed')
		throw error(500, { message: 'Failed to load ticket' })
	}
}

export const actions = {
	update_ticket: async ({ request, params, locals }) => {
		try {
			const form_data = await request.formData()
			const updates: Record<string, string | undefined> = {}

			const fields = ['status', 'client_name', 'client_email', 'pickup_location', 'delivery_location', 'item_description', 'estimated_delivery', 'notes']
			for (const field of fields) {
				const value = form_data.get(field)?.toString()
				if (value !== undefined && value !== null) {
					updates[field] = value || undefined
				}
			}

			const ticket_id = params.id as string
			const ticket = await DSERVICE_update_ticket(locals.sb, ticket_id, updates)

			return { success: true, ticket }
		} catch (e) {
			const app_error = handle_error(e, 'ENDPOINT', 'update_ticket_failed')
			return fail(500, { error: 'Failed to update ticket' })
		}
	}
} satisfies Actions
