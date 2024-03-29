<script lang="ts">
	import type { HTMLBaseAttributes } from 'svelte/elements';

	// adapted from https://github.com/radix-ui/primitives/blob/main/packages/react/separator/src/Separator.tsx
	const DEFAULT_ORIENTATION = 'horizontal';
	const ORIENTATIONS = ['horizontal', 'vertical'] as const;

	type Orientation = (typeof ORIENTATIONS)[number];

	interface SeparatorProps {
		/**
		 * Whether or not the component is purely decorative. When true, accessibility-related attributes
		 * are updated so that that the rendered element is removed from the accessibility tree.
		 */
		decorative?: boolean;
		/**
		 * Either `vertical` or `horizontal`. Defaults to `horizontal`.
		 */
		orientation?: Orientation;
	}
	import { cn } from '@margins/lib';
	export let ref: HTMLDivElement | undefined = undefined;
	export let orientation: Orientation = DEFAULT_ORIENTATION;
	export let decorative: boolean = true;
	let className: string | null | undefined = '';
	export { className as class };

	// `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
	$: ariaOrientation = orientation === 'vertical' ? orientation : undefined;
	$: semanticProps = decorative
		? { role: 'none' }
		: { 'aria-orientation': ariaOrientation, role: 'separator' };

	interface $$Props extends SeparatorProps, HTMLBaseAttributes {
		ref?: HTMLDivElement;
	}
</script>

<div
	class={cn(
		'bg-border shrink-0',
		orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
		className,
	)}
	data-orientation={orientation}
	{...semanticProps}
	{...$$restProps}
	bind:this={ref}
/>
