<!-- TODO: make this into a web component to avoid style specificity wars -->
<!-- <svelte:options customElement="margins-sidebar" /> -->

<script lang="ts">
	import '@margins/ui/styles/style.css';
	import { Button, Logo } from '@margins/ui';
	import { writable } from 'svelte/store';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
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
		style:z-index={zIndex}
		bind:this={$el}
		class=""
	></div>
{/if}

<style>
	div[data-margins-sidebar-button] :global(button) {
		background-color: black;
	}
	div[data-margins-sidebar] {
		position: fixed;
		right: 0;
		top: 0;
		bottom: 0;
		width: 20rem;
		background-color: red;
	}
</style>
