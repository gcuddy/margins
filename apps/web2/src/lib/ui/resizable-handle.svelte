<script lang="ts">
	import * as PanePrimitive from 'paneforge';
	import { tv } from 'tailwind-variants';

	type Props = PanePrimitive.PaneResizerProps;

	let { children, class: className, ...rest }: Props = $props();

	const resizer = tv({
		base: [
			'bg-gray-6a focus-visible:ring-focus-8 relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 data-[direction=vertical]:h-px data-[direction=vertical]:w-full data-[direction=vertical]:after:left-0 data-[direction=vertical]:after:h-1 data-[direction=vertical]:after:w-full data-[direction=vertical]:after:-translate-y-1/2 data-[direction=vertical]:after:translate-x-0 [&[data-direction=vertical]>div]:rotate-90'
		]
	});
</script>

<PanePrimitive.PaneResizer class={resizer({ className })} {...rest}>
	{#if children}
		{@render children()}
	{/if}
</PanePrimitive.PaneResizer>
