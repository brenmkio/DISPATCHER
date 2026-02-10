<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'

	interface Props {
		form: ActionData
	}

	let { form }: Props = $props()

	let is_submitting = $state(false)
</script>

<div class="login-container">
	<h1>Admin Login</h1>

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
	>
		<div class="form-group">
			<label for="email">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				value={form?.email || ''}
				required
			/>
		</div>

		<div class="form-group">
			<label for="password">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				required
			/>
		</div>

		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		<button type="submit" disabled={is_submitting}>
			{is_submitting ? 'Signing in...' : 'Sign In'}
		</button>
	</form>
</div>
