<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'
	
	interface Props {
		form: ActionData
	}
	
	let { form }: Props = $props()
	
	let is_submitting = $state(false)
</script>

<section class="form-section">
	<h2>Example Form</h2>
	<p class="form-description">
		This demonstrates a form with use:enhance, validation, and error handling.
	</p>
	
	<form 
		method="POST" 
		action="?/submit_example"
		use:enhance={() => {
			is_submitting = true
			return async ({ update }) => {
				await update()
				is_submitting = false
			}
		}}
	>
		<div class="form-group">
			<label for="name">Name</label>
			<input 
				type="text" 
				id="name" 
				name="name" 
				value={form?.name || ''}
				required
			/>
		</div>
		
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
		
		{#if form?.error}
			<div class="error-message">
				{form.error}
			</div>
		{/if}
		
		{#if form?.success}
			<div class="success-message">
				{form.message}
			</div>
		{/if}
		
		<button type="submit" disabled={is_submitting}>
			{is_submitting ? 'Submitting...' : 'Submit'}
		</button>
	</form>
</section>

<style>
	.form-section {
		margin-top: 2rem;
		padding: 1.5rem;
		border: 1px solid black;
	}
	
	h2 {
		font-size: 1.5rem;
		font-weight: normal;
		margin: 0 0 0.5rem 0;
	}
	
	.form-description {
		margin: 0 0 1.5rem 0;
		font-style: italic;
	}
	
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	
	label {
		font-weight: bold;
	}
	
	input {
		padding: 0.5rem;
		border: 1px solid black;
		font-family: 'Times New Roman', Times, serif;
		font-size: 1rem;
	}
	
	input:focus {
		outline: 2px solid black;
		outline-offset: 2px;
	}
	
	button {
		padding: 0.75rem 1.5rem;
		border: 1px solid black;
		background: white;
		font-family: 'Times New Roman', Times, serif;
		font-size: 1rem;
		cursor: pointer;
	}
	
	button:hover:not(:disabled) {
		background: black;
		color: white;
	}
	
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.error-message {
		padding: 0.75rem;
		border: 1px solid black;
		background: #ffe0e0;
		color: #c00;
	}
	
	.success-message {
		padding: 0.75rem;
		border: 1px solid black;
		background: #e0ffe0;
		color: #060;
	}
</style>
