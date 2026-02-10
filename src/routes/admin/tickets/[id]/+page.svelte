<script lang="ts">
	import type { PageData, ActionData } from './$types'
	import TicketForm from '$lib/components/TicketForm.svelte'
	import StatusBadge from '$lib/components/StatusBadge.svelte'

	interface Props {
		data: PageData
		form: ActionData
	}

	let { data, form }: Props = $props()

	let is_url_copied = $state(false)

	const tracking_url = $derived(
		typeof window !== 'undefined'
			? `${window.location.origin}/track/${data.ticket?.id}`
			: `/track/${data.ticket?.id}`
	)

	async function copy_tracking_url() {
		try {
			await navigator.clipboard.writeText(tracking_url)
			is_url_copied = true
			setTimeout(() => { is_url_copied = false }, 2000)
		} catch {
			// Fallback: select the text in the input
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white border-b border-gray-200">
		<div class="max-w-3xl mx-auto px-4 py-4">
			<a href="/admin/dashboard" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
				&larr; Back to Dashboard
			</a>
		</div>
	</header>

	<main class="max-w-3xl mx-auto px-4 py-6 space-y-6">
		{#if form?.success}
			<div class="rounded-md bg-green-50 border border-green-200 p-4">
				<p class="text-sm text-green-700">Ticket updated successfully.</p>
			</div>
		{/if}

		{#if data.ticket}
			<div class="bg-white rounded-lg border border-gray-200 p-6">
				<div class="flex items-center justify-between mb-2">
					<h1 class="text-lg font-bold text-gray-900">Edit Ticket</h1>
					<StatusBadge status={data.ticket.status} />
				</div>
				<p class="text-xs text-gray-500 mb-6">ID: {data.ticket.id}</p>

				<div class="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
					<label for="tracking_url" class="block text-sm font-medium text-gray-700 mb-2">Tracking URL</label>
					<div class="flex gap-2">
						<input
							type="text"
							id="tracking_url"
							readonly
							value={tracking_url}
							class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white text-gray-600"
						/>
						<button
							onclick={copy_tracking_url}
							class="px-4 py-2 text-sm font-medium rounded-md transition-colors {is_url_copied ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
						>
							{is_url_copied ? 'Copied!' : 'Copy'}
						</button>
					</div>
				</div>

				<TicketForm
					ticket={data.ticket}
					action="?/update_ticket"
					is_edit={true}
					error_message={form?.error}
				/>
			</div>
		{/if}
	</main>
</div>
