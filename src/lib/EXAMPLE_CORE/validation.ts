export function is_valid_email(email: string): boolean {
	const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return email_regex.test(email)
}

export function is_valid_url(url: string): boolean {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

export function is_valid_uuid(uuid: string): boolean {
	const uuid_regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
	return uuid_regex.test(uuid)
}

export function is_valid_phone(phone: string): boolean {
	const phone_regex = /^\+?[\d\s\-()]+$/
	return phone_regex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export function sanitize_html(html: string): string {
	if (typeof document === 'undefined') {
		return html.replace(/[&<>"']/g, (char) => {
			const entities: Record<string, string> = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;'
			}
			return entities[char] || char
		})
	}
	const temp = document.createElement('div')
	temp.textContent = html
	return temp.innerHTML
}

export function validate_required(value: unknown, field_name: string): string | null {
	if (value === null || value === undefined || value === '') {
		return `${field_name} is required`
	}
	return null
}

export function validate_min_length(value: string, min: number, field_name: string): string | null {
	if (value.length < min) {
		return `${field_name} must be at least ${min} characters`
	}
	return null
}

export function validate_max_length(value: string, max: number, field_name: string): string | null {
	if (value.length > max) {
		return `${field_name} must be no more than ${max} characters`
	}
	return null
}

export function validate_range(value: number, min: number, max: number, field_name: string): string | null {
	if (value < min || value > max) {
		return `${field_name} must be between ${min} and ${max}`
	}
	return null
}

export function validate_pattern(value: string, pattern: RegExp, field_name: string, message?: string): string | null {
	if (!pattern.test(value)) {
		return message || `${field_name} format is invalid`
	}
	return null
}

export function collect_validation_errors(validators: (() => string | null)[]): string[] {
	return validators
		.map(validator => validator())
		.filter((error): error is string => error !== null)
}
