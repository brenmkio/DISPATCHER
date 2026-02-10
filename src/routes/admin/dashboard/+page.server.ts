import { error, redirect, type Actions } from '@sveltejs/kit'
import { handle_error } from '$lib/EXAMPLE_CORE/errors'
import { DSERVICE_get_all_tickets } from '$lib/DISPATCHER/service'

export const load = async ({ locals }) => {
	try {
		const tickets = await DSERVICE_get_all_tickets(locals.sb)

		return {
			tickets
		}
	} catch (e) {
		const app_error = handle_error(e, 'LOAD', 'dashboard_load_failed')
		throw error(500, { message: 'Failed to load dashboard data' })
	}
}

export const actions = {
	logout: async ({ locals }) => {
		await locals.sb.auth.signOut()
		redirect(303, '/admin/login')
	}
} satisfies Actions
