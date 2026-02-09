export type Error_Frame = {
	layer: 'DAL' | 'AI' | 'SERVICE' | 'ENDPOINT' | 'LOAD' | 'UI'
	code: string
	message?: string
	context?: Record<string, any>
	timestamp?: string
}

export type App_Error = {
	kind: 'App_Error'
	frames: Error_Frame[]
	dev_stack?: string
	dev_message?: string
	origin?: unknown
}

export interface App_Error_Client {
	code: string
	message: string
	stack?: string
	frames?: Error_Frame[]
	origin?: unknown
}

export type Success_Response<T> = {
	success: true
	data: T
	error: null
}

export type Error_Response = {
	success: false
	data: null
	error: App_Error_Client
}

export type API_Response<T> = Success_Response<T> | Error_Response
