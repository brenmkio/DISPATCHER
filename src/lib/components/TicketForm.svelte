<script lang="ts">
	import { enhance } from '$app/forms'
	import type { Dispatcher_Tickets_Schema } from '$lib/DISPATCHER/types'

	interface Props {
		ticket?: Dispatcher_Tickets_Schema
		action: string
		is_edit?: boolean
	}

	let { ticket, action, is_edit = false }: Props = $props()

	let is_submitting = $state(false)
</script>

<form
	method="POST"
	action={action}
	use:enhance={() => {
		is_submitting = true
		return async ({ update }) => {
			await update()
			is_submitting = false
		}
	}}
>
	<p>Ticket form - full implementation pending.</p>

	<button type="submit" disabled={is_submitting}>
		{is_submitting ? 'Saving...' : is_edit ? 'Update Ticket' : 'Create Ticket'}
	</button>
</form>
