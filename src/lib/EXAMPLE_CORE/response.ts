import { dev } from '$app/environment'
import { json } from '@sveltejs/kit'
import type { App_Error, App_Error_Client } from './types'

export function create_response<T>(data: T, status = 200): Response {
	return json({ success: true, data, error: null }, { status })
}

export function create_error_response(err: App_Error, status = 500): Response {
	const latest_frame = err.frames[err.frames.length - 1]
	
	const error_payload: App_Error_Client = {
		code: latest_frame.code,
		message: latest_frame.message || 'An error occurred',
		stack: dev ? err.dev_stack : undefined,
		frames: dev ? err.frames : undefined,
		origin: dev ? err.origin : undefined
	}

	return json(
		{ success: false, data: null, error: error_payload },
		{ status }
	)
}

export async function fetch_json<T = any>(
	url: string,
	options: RequestInit = {}
): Promise<{ res_data: T | null; res_error: App_Error_Client | null }> {
	try {
		const res = await fetch(url, options)
		const json_data = await res.json()

		if (json_data.success === false && json_data.error) {
			const err: App_Error_Client = {
				code: json_data.error.code,
				message: json_data.error.message,
				stack: json_data.error.stack,
				frames: json_data.error.frames,
				origin: json_data.error.origin
			}
			return { res_data: null, res_error: err }
		}

		return { res_data: json_data.data as T, res_error: null }
	} catch (err) {
		const fallback: App_Error_Client = {
			code: 'network_error',
			message: 'Network error. Please check your connection and try again.'
		}
		return { res_data: null, res_error: fallback }
	}
}

export function handle_fetch_error(res_error: App_Error_Client | null): never {
	if (res_error) {
		throw new Error(res_error.message)
	}
	throw new Error('Unknown error occurred')
}
