<script lang="ts">
	import IntersectionObserver from "$lib/components/helpers/IntersectionObserver.svelte";
	import Image from "./Image.svelte";
	import { ComponentProps, onMount } from "svelte";

	let nativeLoading = false;
	export let alt: string;
	export let src: string;
	interface $$Props extends ComponentProps<Image> {
		alt: string;
		src: string;
	}
	// Determine whether to bypass our intersecting check
	onMount(() => {
		if ("loading" in HTMLImageElement.prototype) {
			nativeLoading = true;
		}
	});
</script>

<IntersectionObserver once={true} let:intersecting>
	{#if intersecting || nativeLoading}
		<Image on:error {alt} {src} {...$$restProps} />
	{/if}
</IntersectionObserver>
