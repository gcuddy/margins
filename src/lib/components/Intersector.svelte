<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	// Component that emits events when it arrives on screen
	export let cb: () => void;
	let io: IntersectionObserver | undefined = undefined;
	let ref: HTMLElement | undefined = undefined;
	onMount(() => {
		io = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					cb();
				}
			});
		});
		if (ref) io.observe(ref);
	});

	onDestroy(() => {
		if (io && ref) io.unobserve(ref);
	});
</script>

<div bind:this={ref}>
	<slot />
</div>
