<script lang="ts">
	import { enhance } from '$lib/actions/form';
	import { notifications } from '$lib/stores/notifications';
	import { modals } from '$lib/stores/modals';
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import { invalidate } from '$app/navigation';
	import Spinner from '../Spinner.svelte';
	export let term = '';
	export let placeholder = 'Enter URL...';
	let input: HTMLInputElement;
	export let modalIndex: number;
	let pending = false;
	export let formAction = '/add';
	// onMount(() => {
	// 	browser && input && input.focus();
	// });
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
				await invalidate('/');
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
			<!-- svelte-ignore a11y-autofocus -->
			<input
				bind:this={input}
				name="text"
				type="text"
				bind:value={term}
				{placeholder}
				class="w-full border-0 bg-inherit focus:ring-0"
			/>
		{:else}
			<div class="flex items-center justify-center">
				<Spinner />
			</div>
		{/if}
	</form>
</div>
