<script lang="ts">
	import { writable } from 'svelte/store';
	export let zIndex = 1000;

	console.log('hello');

	let el = writable();
	$: console.log({ $el });
</script>

<div style:z-index={zIndex} bind:this={$el} class=" bg-blue-400"></div>

<style>
	div {
		position: fixed;
		right: 0;
		top: 0;
		bottom: 0;
		width: 20rem;
		background-color: red;
	}
</style>
