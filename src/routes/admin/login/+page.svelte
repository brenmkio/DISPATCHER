<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'

	interface Props {
		form: ActionData
	}

	let { form }: Props = $props()

	let is_submitting = $state(false)
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
	<div class="w-full max-w-sm">
		<div class="text-center mb-8">
			<h1 class="text-2xl font-bold text-gray-900">Dispatcher</h1>
			<p class="text-sm text-gray-500 mt-1">Admin Login</p>
		</div>

		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					is_submitting = true
					return async ({ update }) => {
						await update()
						is_submitting = false
					}
				}}
				class="space-y-4"
			>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						value={form?.email || ''}
						required
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
						placeholder="admin@example.com"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
						placeholder="Enter your password"
					/>
				</div>

				{#if form?.error}
					<div class="rounded-md bg-red-50 border border-red-200 p-3">
						<p class="text-sm text-red-700">{form.error}</p>
					</div>
				{/if}

				<button
					type="submit"
					disabled={is_submitting}
					class="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{is_submitting ? 'Signing in...' : 'Sign In'}
				</button>
			</form>
		</div>
	</div>
</div>
