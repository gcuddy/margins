<script lang="ts">
	import ImageSkeleton from "$lib/components/layout/Skeletons/ImageSkeleton.svelte";
	import { onMount } from "svelte";
	import type { HTMLImgAttributes } from "svelte/elements";

	let loaded = false;
	let thisImage: HTMLImageElement;

	export let alt = "";
	export let src = "";

	interface $$Props extends HTMLImgAttributes {
		alt: string;
		src: string;
	}

	onMount(() => {
		thisImage.onload = () => {
			loaded = true;
		};
	});
</script>

<img {alt} {src} {...$$restProps} class:loaded bind:this={thisImage} loading="lazy" />
<ImageSkeleton
	class="absolute inset-0 {loaded ? 'opacity-0' : src ? 'animate-pulse' : 'opacity-100'} transition-opacity duration-100"
/>

<style>
	img {
		opacity: 0;
		transition: opacity 100ms ease-out;
	}
	img.loaded {
		opacity: 1;
	}
</style>
