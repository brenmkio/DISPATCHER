import { fail, redirect, type Actions } from '@sveltejs/kit'
import { handle_error } from '$lib/EXAMPLE_CORE/errors'

export const load = async () => {
	return {}
}

export const actions = {
	login: async ({ request, locals }) => {
		try {
			const form_data = await request.formData()
			const email = form_data.get('email')?.toString() || ''
			const password = form_data.get('password')?.toString() || ''

			if (!email || !password) {
				return fail(400, { error: 'Email and password are required', email })
			}

			const { error } = await locals.sb.auth.signInWithPassword({
				email,
				password
			})

			if (error) {
				return fail(401, { error: 'Invalid email or password', email })
			}

			redirect(303, '/admin/dashboard')
		} catch (e) {
			if (e && typeof e === 'object' && 'status' in e && (e as any).status === 303) {
				throw e
			}
			const app_error = handle_error(e, 'ENDPOINT', 'login_failed')
			return fail(500, { error: 'An unexpected error occurred', email: '' })
		}
	}
} satisfies Actions
