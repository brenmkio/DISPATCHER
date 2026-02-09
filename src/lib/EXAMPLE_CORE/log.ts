import { dev } from '$app/environment'

export function dev_log(...args: any[]) {
	if (dev) console.log('\n\n[DEV]\n\n', ...args)
}

export function dev_warn(...args: any[]) {
	if (dev) console.warn('\n\n[DEV WARNING]\n\n', ...args)
}

export function dev_error(...args: any[]) {
	if (dev) console.error('\n\n[DEV ERROR]\n\n', ...args)
}

export function dev_table(data: any) {
	if (dev) {
		console.log('\n\n[DEV TABLE]\n\n')
		console.table(data)
	}
}

export function dev_time(label: string) {
	if (dev) console.time(`[DEV] ${label}`)
}

export function dev_time_end(label: string) {
	if (dev) console.timeEnd(`[DEV] ${label}`)
}
