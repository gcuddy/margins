<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { useCommand } from "./Command.Root.svelte";

	const context = useCommand();
	let sizer: HTMLElement | null = null;
	let wrapper: HTMLElement | null = null;

	let animationFrame: number | undefined;
	let observer: ResizeObserver | undefined;
	onMount(() => {
		if (sizer && wrapper) {
			// tOdo
			observer = new ResizeObserver(() => {
				animationFrame = requestAnimationFrame(() => {
					if (!sizer || !wrapper) return;
					const height = sizer.getBoundingClientRect().height;
					wrapper.style.setProperty(
						`--cmdk-list-height`,
						height.toFixed(1) + "px"
					);
				});
			});
			observer.observe(sizer);
		}
	});
	onDestroy(() => {
		if (animationFrame) cancelAnimationFrame(animationFrame);
		if (sizer && observer) observer.unobserve(sizer);
	});
</script>

<div
	{...$$restProps}
	bind:this={wrapper}
	data-cmdk-list
	role="listbox"
	aria-label="Suggestions"
	id={$context.listId}
	aria-labelledby={$context.inputId}
	aria-multiselectable={$context.multiple ? true : undefined}
>
	<div data-cmdk-list-sizer bind:this={sizer}>
		<slot />
	</div>
</div>
