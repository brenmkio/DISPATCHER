<script lang="ts">
	import type { ActionData } from './$types'
	import TicketForm from '$lib/components/TicketForm.svelte'

	interface Props {
		form: ActionData
	}

	let { form }: Props = $props()

	const form_values = $derived(
		form ? form as Record<string, string | undefined> : undefined
	)
</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white border-b border-gray-200">
		<div class="max-w-3xl mx-auto px-4 py-4">
			<a href="/admin/dashboard" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
				&larr; Back to Dashboard
			</a>
		</div>
	</header>

	<main class="max-w-3xl mx-auto px-4 py-6">
		<div class="bg-white rounded-lg border border-gray-200 p-6">
			<h1 class="text-lg font-bold text-gray-900 mb-6">Create New Ticket</h1>

			<TicketForm
				action="?/create_ticket"
				error_message={form?.error}
				form_data={form_values}
			/>
		</div>
	</main>
</div>
