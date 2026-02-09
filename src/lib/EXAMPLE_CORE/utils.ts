export function debug_data(label: string, data: unknown, active: boolean = false) {
	if (!active) return
	console.log(`\n🧪 [${label}]\n`, JSON.stringify(data, null, 2))
}

export function console_log(title: string, content: any = null, optional_content: any[] = []) {
	const debug = true
	if (debug) {
		console.log('\n\n\n\n' + title + '\n\n')
		if (content !== null && content !== undefined) {
			console.log(content)
		} else if (content === undefined) {
			console.log("undefined")
		} else if (content === null) {
			console.log("null")
		} else if (content === "") {
			console.log("empty string")
		} else if (content === 0) {
			console.log("0")
		} else if (content === false) {
			console.log("false")
		} else {
			console.log("unknown falsy value")
		}
		if (optional_content.length > 0) {
			console.log(optional_content)
		}
	}
}

export function dupe<T>(data: T): T {
	if (Array.isArray(data)) {
		return JSON.parse(JSON.stringify(data))
	} else if (typeof data === 'object' && data !== null) {
		return JSON.parse(JSON.stringify(data))
	} else {
		return data
	}
}

export function deduplicate_array<T extends Record<string, any>>(
	arr: T[],
	exclusion_criteria: (item: T) => boolean = () => false,
	exclude_dupe_properties: string[] = []
): { items: T[], map: Record<number, number> } {
	const seen: Record<string, number> = {}
	const deduped_items: T[] = []
	const map: Record<number, number> = {}

	arr.forEach((item, index) => {
		if (exclusion_criteria(item)) {
			map[index] = -1
		} else {
			const item_copy: any = { ...item }
			for (const property of exclude_dupe_properties) {
				delete item_copy[property]
			}
			const key = JSON.stringify(Object.entries(item_copy).sort())

			if (seen[key] === undefined) {
				seen[key] = deduped_items.length
				deduped_items.push(item)
			}
			map[index] = seen[key]
		}
	})

	return { items: deduped_items, map }
}

export function recreate_id_array(arr: any[], map: Record<number, number>): any[] {
	const ids = new Array(arr.length).fill(null)
	for (const [key, value] of Object.entries(map)) {
		if (value === -1) {
			ids[Number(key)] = -1
			continue
		}

		ids[Number(key)] = arr[value].id
	}

	return ids
}

export function map_from_id_to_id(arr_1: any[], arr_2: number[]): Record<number, number> {
	const map: Record<number, number> = {}
	for (let i = 0; i < arr_1.length; i++) {
		if (arr_1[i].id !== undefined) {
			map[arr_1[i].id] = arr_2[i]
		}
		map[arr_2[i]] = arr_2[i]
	}
	return map
}

export function set_prop<T extends object, K extends keyof T>(obj: T, prop: K, value: T[K]) {
	obj[prop] = value
}

export function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export function chunk_array<T>(array: T[], chunk_size: number): T[][] {
	const chunks: T[][] = []
	for (let i = 0; i < array.length; i += chunk_size) {
		chunks.push(array.slice(i, i + chunk_size))
	}
	return chunks
}

export function unique_by<T>(array: T[], key_fn: (item: T) => string | number): T[] {
	const seen = new Set<string | number>()
	return array.filter(item => {
		const key = key_fn(item)
		if (seen.has(key)) {
			return false
		}
		seen.add(key)
		return true
	})
}

export function group_by<T>(array: T[], key_fn: (item: T) => string | number): Record<string | number, T[]> {
	return array.reduce((groups, item) => {
		const key = key_fn(item)
		if (!groups[key]) {
			groups[key] = []
		}
		groups[key].push(item)
		return groups
	}, {} as Record<string | number, T[]>)
}

export function sort_by<T>(array: T[], key_fn: (item: T) => number | string, order: 'asc' | 'desc' = 'asc'): T[] {
	return [...array].sort((a, b) => {
		const a_val = key_fn(a)
		const b_val = key_fn(b)
		if (a_val < b_val) return order === 'asc' ? -1 : 1
		if (a_val > b_val) return order === 'asc' ? 1 : -1
		return 0
	})
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max)
}

export function random_int(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function random_item<T>(array: T[]): T | undefined {
	if (array.length === 0) return undefined
	return array[Math.floor(Math.random() * array.length)]
}

export function shuffle<T>(array: T[]): T[] {
	const shuffled = [...array]
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}
	return shuffled
}

export function is_empty(value: unknown): boolean {
	if (value === null || value === undefined) return true
	if (typeof value === 'string') return value.trim().length === 0
	if (Array.isArray(value)) return value.length === 0
	if (typeof value === 'object') return Object.keys(value).length === 0
	return false
}

export function truncate(str: string, max_length: number, suffix: string = '...'): string {
	if (str.length <= max_length) return str
	return str.substring(0, max_length - suffix.length) + suffix
}

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function title_case(str: string): string {
	return str
		.toLowerCase()
		.split(' ')
		.map(word => capitalize(word))
		.join(' ')
}

export function parse_json_safe<T = any>(json_string: string, fallback: T): T {
	try {
		return JSON.parse(json_string)
	} catch {
		return fallback
	}
}

export function format_date(date: Date | string, format: 'short' | 'long' | 'iso' = 'short'): string {
	const d = typeof date === 'string' ? new Date(date) : date

	if (format === 'iso') {
		return d.toISOString()
	}

	if (format === 'long') {
		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}

export function time_ago(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date
	const now = new Date()
	const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

	const intervals = {
		year: 31536000,
		month: 2592000,
		week: 604800,
		day: 86400,
		hour: 3600,
		minute: 60,
		second: 1
	}

	for (const [unit, seconds_in_unit] of Object.entries(intervals)) {
		const interval = Math.floor(seconds / seconds_in_unit)
		if (interval >= 1) {
			return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
		}
	}

	return 'just now'
}
