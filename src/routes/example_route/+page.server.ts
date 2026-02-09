import { error, fail, type Actions } from '@sveltejs/kit'
import { handle_error } from '$lib/EXAMPLE_CORE/errors'

export const load = async () => {
	try {
		const example_data = {
			title: 'SvelteKit Template',
			description: 'A foundational template with established patterns and architecture',
			features: [
				'Layered architecture (DAL, SERVICE, UTILS)',
				'Structured error handling with frames',
				'Type-safe database operations',
				'Deduplication and ID mapping patterns',
				'Comprehensive validation utilities',
				'Development logging helpers'
			],
			stats: {
				domains: 2,
				utilities: 15,
				patterns: 6
			}
		}

		return {
			example_data
		}
	} catch (e) {
		const app_error = handle_error(e, 'LOAD', 'example_load_failed')
		throw error(500, {
			message: 'Failed to load example page data'
		})
	}
}


export const actions = {
    submit_example: async ({ request }) => {
        try {
            const form_data = await request.formData()
            const name = form_data.get('name')?.toString() || ''
            const email = form_data.get('email')?.toString() || ''

            if (!name || name.length < 2) {
                return fail(400, {
                    error: 'Name must be at least 2 characters',
                    name,
                    email
                })
            }

            if (!email || !email.includes('@')) {
                return fail(400, {
                    error: 'Please enter a valid email address',
                    name,
                    email
                })
            }

            return {
                success: true,
                message: `Thank you, ${name}! Form submitted successfully.`
            }
        } catch (e) {
            const app_error = handle_error(e, 'ENDPOINT', 'form_submission_failed')
            return fail(500, {
                error: 'An unexpected error occurred. Please try again.'
            })
        }
    }
} satisfies Actions
