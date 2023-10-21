<script lang="ts">
	import type {
		SvelteVirtualizer,
		VirtualItem,
	} from "@tanstack/svelte-virtual";
	import { onMount } from "svelte";
	// TODO: use context instead of passing in virtualizer?
	export let ref: (el: Element) => void;
	export let item: VirtualItem;
	let el: HTMLElement;
	onMount(() => {
		if (ref && el) {
			console.log(`Mounting`, item);
			ref(el);
		}
	});
</script>

<div bind:this={el} data-index={item.index}>
	<slot />
</div>
