import { fail, redirect, type Actions } from '@sveltejs/kit'
import { handle_error } from '$lib/EXAMPLE_CORE/errors'
import { DSERVICE_create_ticket } from '$lib/DISPATCHER/service'

export const load = async () => {
	return {}
}

export const actions = {
	create_ticket: async ({ request, locals }) => {
		try {
			const form_data = await request.formData()
			const client_name = form_data.get('client_name')?.toString() || ''
			const client_email = form_data.get('client_email')?.toString() || ''
			const pickup_location = form_data.get('pickup_location')?.toString() || ''
			const delivery_location = form_data.get('delivery_location')?.toString() || ''
			const item_description = form_data.get('item_description')?.toString() || ''
			const estimated_delivery = form_data.get('estimated_delivery')?.toString() || undefined
			const notes = form_data.get('notes')?.toString() || undefined

			if (!client_name || !client_email || !pickup_location || !delivery_location || !item_description) {
				return fail(400, {
					error: 'All required fields must be filled',
					client_name,
					client_email,
					pickup_location,
					delivery_location,
					item_description,
					estimated_delivery,
					notes
				})
			}

			const ticket = await DSERVICE_create_ticket(locals.sb, {
				status: 'pending',
				client_name,
				client_email,
				pickup_location,
				delivery_location,
				item_description,
				estimated_delivery,
				notes
			})

			redirect(303, `/admin/tickets/${ticket.id}`)
		} catch (e) {
			if (e && typeof e === 'object' && 'status' in e && (e as any).status === 303) {
				throw e
			}
			const app_error = handle_error(e, 'ENDPOINT', 'create_ticket_failed')
			return fail(500, { error: 'Failed to create ticket' })
		}
	}
} satisfies Actions
