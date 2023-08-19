<script lang="ts">
	import { cn } from '$lib/utils';
	import { ctx } from './ctx';
	import type { DivProps } from './types';

	const { ids } = ctx.get();

	type $$Props = DivProps & {
		el?: HTMLElement | null;
        animateHeight?: boolean;
	};
	let className: $$Props['class'] = undefined;
    export { className as class};
	export let unstyled = false;

    export let animateHeight = true;

	/** Read Only */
	export let el: HTMLElement | null = null;

	let borderBoxSize: { blockSize: number; inlineSize: number }[];

	$: width = borderBoxSize?.[0]?.inlineSize;
	$: height = borderBoxSize?.[0]?.blockSize;
</script>

<div
	style:--width="{width}px"
	style:--height="{height}px"
	id={ids.menu}
	class={cn(!unstyled && 'max-h-[300px] overflow-y-auto overflow-x-hidden overscroll-contain',
    animateHeight && 'h-[min(300px,var(--height))] max-h-[400px] transition-[height] ease-in-out duration-100',
    className)}
	role="listbox"
    bind:this={el}
>
	<div bind:borderBoxSize data-command-sizer>
		<slot />
	</div>
</div>

<style>
</style>
