<script lang="ts">
	import { onMount } from "svelte";

	export let isOpen = false;
	let div: HTMLDivElement;
	onMount(() => {
		div.querySelector("button")?.addEventListener("click", () => {
			isOpen = !isOpen;
		});
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this={div}>
	<slot />
</div>

<style>
	div {
		display: contents;
	}
</style>
