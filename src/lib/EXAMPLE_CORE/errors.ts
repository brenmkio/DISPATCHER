import type { App_Error, Error_Frame } from './types'

export function create_app_error(frame: Error_Frame, origin?: unknown): App_Error {
	return {
		kind: 'App_Error',
		frames: [{ ...frame, timestamp: new Date().toISOString() }],
		dev_stack: new Error().stack,
		dev_message: frame.message,
		origin
	}
}

export function push_error_frame(err: App_Error, frame: Error_Frame): App_Error {
	return {
		...err,
		frames: [
			...err.frames,
			{ ...frame, timestamp: new Date().toISOString() }
		]
	}
}

export function is_app_error(err: unknown): err is App_Error {
	return typeof err === 'object' && err !== null && (err as App_Error).kind === 'App_Error'
}

export function handle_error(
	err: unknown,
	layer: 'ENDPOINT' | 'LOAD',
	code = 'unhandled_error',
	context: Record<string, any> = {}
): App_Error {
	if (is_app_error(err)) {
		return push_error_frame(err, {
			layer,
			code,
			context,
			message: err.frames[err.frames.length - 1]?.message || 'Propagated error'
		})
	}

	return create_app_error({
		layer,
		code,
		context,
		message: (err as Error)?.message || 'Unknown error'
	}, err)
}

export function get_user_friendly_message(err: App_Error): string {
	const latest_frame = err.frames[err.frames.length - 1]
	return latest_frame.message || 'An unexpected error occurred'
}

export function get_error_code(err: App_Error): string {
	const latest_frame = err.frames[err.frames.length - 1]
	return latest_frame.code
}
