<script lang="ts">
	import { cn } from '$lib/utils';
	import { ctx } from './ctx';
	import type { DivProps } from './types';

	const { ids } = ctx.get();

	type $$Props = DivProps;
	let className: $$Props['class'] = undefined;
	export let unstyled = false;

	let borderBoxSize: { blockSize: number; inlineSize: number }[];

	$: width = borderBoxSize?.[0]?.inlineSize;
	$: height = borderBoxSize?.[0]?.blockSize;
</script>

<div
	style:--width="{width}px"
	style:--height="{height}px"
	id={ids.menu}
	class={cn(!unstyled && 'max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
	role="listbox"
>
	<div bind:borderBoxSize data-command-sizer>
		<slot />
	</div>
</div>

<style>
	[role='listbox'] {
		height: min(300px, var(--height));
		max-height: 400px;
		overflow: auto;
		-ms-scroll-chaining: none;
		overscroll-behavior: contain;
		transition: 0.1s ease;
		transition-property: height;
	}
</style>
