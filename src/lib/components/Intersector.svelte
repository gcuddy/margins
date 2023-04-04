<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	// Component that emits events when it arrives on screen
	export let cb: () => void;
	let io: IntersectionObserver;
	let ref: HTMLElement;
	onMount(() => {
		io = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					cb();
				}
			});
		});
		io.observe(ref);
	});

	onDestroy(() => {
		io.unobserve(ref);
	});
</script>

<div bind:this={ref}>
	<slot />
</div>
