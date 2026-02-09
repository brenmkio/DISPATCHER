import { json } from '@sveltejs/kit'
import { create_response, create_error_response } from '$lib/EXAMPLE_CORE/response'
import { create_app_error, handle_error } from '$lib/EXAMPLE_CORE/errors'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
	try {
		const name = url.searchParams.get('name')
		
		if (!name) {
			throw create_app_error({
				layer: 'ENDPOINT',
				code: 'missing_parameter',
				context: { parameter: 'name' },
				message: 'Name parameter is required'
			})
		}
		
		const response_data = {
			greeting: `Hello, ${name}!`,
			timestamp: new Date().toISOString(),
			example: 'This is an example API endpoint'
		}
		
		return create_response(response_data)
	} catch (e) {
		const app_error = handle_error(e, 'ENDPOINT', 'get_example_failed')
		return create_error_response(app_error, 400)
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json()
		
		if (!body.message) {
			throw create_app_error({
				layer: 'ENDPOINT',
				code: 'missing_field',
				context: { field: 'message' },
				message: 'Message field is required'
			})
		}
		
		const response_data = {
			received: body.message,
			processed_at: new Date().toISOString(),
			status: 'success'
		}
		
		return create_response(response_data, 201)
	} catch (e) {
		const app_error = handle_error(e, 'ENDPOINT', 'post_example_failed')
		return create_error_response(app_error, 400)
	}
}
