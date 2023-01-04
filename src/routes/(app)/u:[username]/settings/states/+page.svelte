<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MiniSelect from '$lib/components/atoms/MiniSelect.svelte';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/ColorPicker/Input.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import StateListbox from '$lib/components/StateListbox.svelte';
	import { notifications } from '$lib/stores/notifications';
	import { LOCATION_TO_ICON_SOLID } from '$lib/types/schemas/Locations';
	import { Location } from '@prisma/client';

	import ColorPicker from 'svelte-awesome-color-picker';

	$: default_state = $page.data.states?.find(
		(state) => state.id === $page.data.user?.default_state_id
	);
	$: console.log({ default_state });
	let rgb;

	const types = ['Inbox', 'Soon', 'Later', 'Archive'] as const;

	$: editing_id = $page.url.searchParams.get('edit');

	// TODO: Currently, we handle editing state based on search params. This is nice because it's in the URL and doesn't require JS. I'm actually very fond of this pattern.
	// But another (probably more preferrable/expected)  way to do it would be to hit an "editing" form action that just returns an editing: boolean. That way the URL could be copied, without copying the editing state along with it.

	let loading = false;
</script>

<p>States allow you to define how Margins should classify your saved items.</p>

{#each types as type}
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-medium">{type}</h2>
		<button><Icon name="plusMini" className="h-6 w-6 fill-gray-500" /></button>
	</div>
	{#each $page.data.states?.filter((state) => state.type === type.toLowerCase()) || [] as state}
		{@const defaultState = state.id === $page.data.user?.default_state_id}
		{@const editing = editing_id && +editing_id === state.id}
		{#if editing}
			<form
				class="group flex items-center rounded bg-gray-100 p-2 shadow {loading
					? 'animate-pulse'
					: ''}"
				method="post"
				action="?/update"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						notifications.notify({
							title: 'Saved',
							type: 'success',
						});
						await goto($page.url.pathname);
						update({
							reset: false,
						});
						console.log($page.url.pathname);
					};
				}}
			>
				<input type="hidden" name="id" value={state.id} />
				<input type="color" id="state-{state.id}-color" name="color" value={state.color} />
				<GenericInput type="text" name="name" id="name" variant="naked" value={state.name} />
				<Button disabled={loading} as="a" href={$page.url.pathname} size="sm" variant="naked"
					><Muted>Cancel</Muted></Button
				>
				<Button disabled={loading} type="submit" size="sm" variant="naked"
					><Muted>Save</Muted></Button
				>
			</form>
		{:else}
			<div
				class="group flex items-center rounded border border-gray-200 p-2"
				style:--state-color={state.color || '#78716c'}
			>
				<!-- <span>icon</span> -->
				<div class="flex grow items-center gap-2">
					<Icon
						name={LOCATION_TO_ICON_SOLID[state.type]}
						className="h-4 w-4 fill-[var(--state-color)]"
					/>
					<span class="grow">{state.name}</span>
				</div>
				<Button
					as="a"
					href="{$page.url.pathname}?edit={state.id}"
					className="group-hover:opacity-100 opacity-0"
					size="sm"
					variant="naked"><Muted>Edit</Muted></Button
				>
				{#if defaultState}
					<span class="text-xs"><Muted>Default</Muted></span>
				{:else}
					<Button
						className="group-hover:opacity-100 opacity-0"
						formaction="?/makeDefault"
						size="sm"
						variant="naked"><Muted>Make default</Muted></Button
					>
				{/if}
			</div>
		{/if}
	{/each}
{/each}
