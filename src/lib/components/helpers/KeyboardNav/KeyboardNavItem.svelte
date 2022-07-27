<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import { onMount } from 'svelte';
	import type { navStore as INavStore } from './KeyboardNav.svelte';
	export let as: string;
	export let attrs: { [key: string]: string | boolean | undefined | number } | undefined =
		undefined;
	let className = '';
	export { className as class };
	const navStore: typeof INavStore = getContext('navStore');
	let el: HTMLElement | undefined;
	onMount(() => {
		el && navStore.addItem(el);
	});
	onDestroy(() => {
		el && navStore.removeItem(el);
	});
</script>

<svelte:element this={as} bind:this={el} class={className} tabindex="-1" {...attrs}>
	<slot /></svelte:element
>
