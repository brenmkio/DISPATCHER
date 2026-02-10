<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'

	interface Props {
		form: ActionData
	}

	let { form }: Props = $props()

	let is_submitting = $state(false)
</script>

<div class="new-ticket-container">
	<h1>Create New Ticket</h1>
	<p>Ticket creation form - full implementation pending.</p>

	<form
		method="POST"
		action="?/create_ticket"
		use:enhance={() => {
			is_submitting = true
			return async ({ update }) => {
				await update()
				is_submitting = false
			}
		}}
	>
		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		<button type="submit" disabled={is_submitting}>
			{is_submitting ? 'Creating...' : 'Create Ticket'}
		</button>
	</form>
</div>
