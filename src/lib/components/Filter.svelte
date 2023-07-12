<script lang="ts">
	import { page } from '$app/stores';
	import { clickOutside } from '$lib/actions/clickOutside';

	import { filterInputActive, filterTerm } from '$lib/stores/filter';
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import GenericInput from './GenericInput.svelte';
	import Icon from './helpers/Icon.svelte';
	let input: HTMLInputElement | undefined;

	// when page.url changes, reset the input value
	$: $page.url,
		() => {
			$filterTerm = '';
		};
	onDestroy(() => {
		$filterTerm = '';
	});
	let showing = false;

	const focus = () => {
		if (input && showing) {
			input.focus();
		}
	};
	$: showing, focus();
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
			if (!showing || !$filterInputActive) {
				e.preventDefault();
				showing = true;
				input?.focus();
			}
		}
	}}
/>

{#if showing}
	<div
		transition:fly={{
			x: 50
		}}
		on:introend={() => {
			input?.focus();
		}}
		class="group relative w-full"
		use:clickOutside={() => {
			if (!$filterTerm) {
				showing = false;
			}
		}}
	>
		<div class="absolute left-2 flex h-full flex-col justify-center">
			<Icon name="searchSolid" className="h-4 w-4 fill-gray-400" />
		</div>
		<GenericInput
			bind:el={input}
			bind:value={$filterTerm}
			on:keydown={(e) => {
				if (e.key === 'Escape') {
					$filterTerm = '';
					showing = false;
				}
			}}
			on:focus={() => {
				filterInputActive.set(true);
			}}
			on:blur={() => {
				filterInputActive.set(false);
			}}
			placeholder="Search in view…"
			class="px-8"
		/>
		{#if $filterTerm}
			<button
				type="button"
				on:click={() => {
					$filterTerm = '';
					input?.focus();
				}}
				class="absolute right-2 top-0 flex h-full flex-col justify-center opacity-0 transition-opacity group-focus-within:opacity-100"
				><Icon name="xSolid" className="h-4 w-4 fill-gray-400" /></button
			>
		{/if}
	</div>
{/if}
