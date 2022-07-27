<script lang="ts">
	import { enhance } from '$lib/actions/form';
	import { notifications } from '$lib/stores/notifications';
	import { modals } from '$lib/stores/modals';
	import { invalidate } from '$app/navigation';
	import Spinner from '../Spinner.svelte';

	export let term = '';
	export let placeholder = 'Enter URL...';
	export let formAction = '/add';
	let inv = '/';
	export { inv as invalidate };
	export let notification: TODO = undefined;
	export let name = 'text';

	let input: HTMLInputElement;
	let pending = false;
</script>

<div class="w-full p-2">
	<form
		on:submit|preventDefault={() => console.log('submitted')}
		action={formAction}
		method="post"
		use:enhance={{
			pending: async ({ form }) => {
				console.log('pending');
				pending = true;
			},
			result: async ({ form, response }) => {
				modals.close();
				form.reset();
				// pending = false;
				await invalidate(inv);
				response.json().then((article) => {
					notifications.notify({ message: `"${article.title}" added`, type: 'success' });
				});
			},
			error: async ({ form }) => {
				pending = false;
				notifications.notify({ message: 'Error adding URL', type: 'error' });
				form.reset();
				input.focus();
			}
		}}
	>
		{#if !pending}
			<!-- TODO: little css animation like Search? -->
			<div>
				<input
					{placeholder}
					{name}
					type="text"
					class="w-full border-0 bg-inherit focus:ring-0"
					bind:this={input}
					bind:value={term}
				/>
			</div>
		{:else}
			<div class="flex items-center justify-center">
				<Spinner />
			</div>
		{/if}
	</form>
</div>
