<script lang="ts">
	import { tweened } from 'svelte/motion';

	import { cn } from '$lib/utils';

	import { ctx } from './ctx';
	import type { DivProps } from './types';

	const {
		ids,
		measurements: { listHeight },
        options: { animateHeight: _animateHeight, fixedHeight },
	} = ctx.get();

	type $$Props = DivProps & {
		animateHeight?: boolean;
		el?: HTMLElement | null;
	};
	let className: $$Props['class'] = undefined;
	export { className as class };
	export let unstyled = false;

	export let animateHeight = _animateHeight;

	/** Read Only */
	export let el: HTMLElement | null = null;

	let borderBoxSize: Array<{ blockSize: number; inlineSize: number }>;

	$: width = borderBoxSize?.[0]?.inlineSize;
	$: height = borderBoxSize?.[0]?.blockSize;

	$: if (height !== undefined) {
		$listHeight = height;
	}

	// height store with a max height of 300px
</script>

<div
	style:--width="{width}px"
	style:--height="{height}px"
	id={ids.menu}
	class={cn(
		!unstyled &&
			`${fixedHeight ? 'h-96' : 'max-h-[300px]'} overflow-y-auto border-t overflow-x-hidden overscroll-contain`,
		// animateHeight &&
		// 	'h-[min(300px,var(--height))] max-h-[400px] transition-[height] ease-in-out duration-100',
		// className,
	)}
	role="listbox"
	bind:this={el}
>
	<div bind:borderBoxSize data-command-sizer>
		<slot />
	</div>
</div>

<style lang="postcss">
</style>
