<!-- TODO: make this into a web component to avoid style specificity wars -->
<!-- <svelte:options customElement="margins-sidebar" /> -->

<script lang="ts">
	// import '@margins/ui/styles/style.css';
	import { Button, Logo, Textarea } from '@margins/ui';
	import { writable } from 'svelte/store';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ShadowDomWrapper from './shadow-dom-wrapper.svelte';
	export let zIndex = 1000;

	console.log('hello');

	let el = writable();
	$: console.log({ $el });
	let show = false;
	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<ShadowDomWrapper>
	{#if mounted}
		<div
			transition:scale
			style:z-index={zIndex + 1}
			data-margins-sidebar-button
			class="fixed right-4 top-4"
		>
			<Button
				on:click={() => {
					show = !show;
				}}
				size="icon"
				variant="outline"
				class="h-10 w-10"
			>
				<Logo class="h-8 w-8" />
			</Button>
		</div>
	{/if}

	{#if show}
		<div
			data-margins-sidebar
			style:z-index={zIndex - 1}
			class="entry-inspector bg-background-elevation2 fixed bottom-0 right-0 top-0 w-72 overflow-y-auto border-l px-6 py-3.5 text-sm"
			bind:this={$el}
		>
			<Textarea placeholder="Add a note…" />
		</div>
	{/if}
</ShadowDomWrapper>

<style>
	div[data-margins-sidebar-button] :global(button) {
		background-color: black;
	}

	.entry-inspector {
		position: fixed;
		right: 0;
		bottom: 0;
		top: 0;
	}
	div[data-margins-sidebar] {
		position: fixed;
		right: 0;
		top: 0;
		bottom: 0;
		width: 20rem;
	}
</style>
