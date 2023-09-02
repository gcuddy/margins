<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import type { Builder } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils';

	import { colors } from '.';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		builder?: Builder;
		color: string;
        invertDefault?: boolean;
	};

	/**
	 * Optional builder for @melt-ui
	 */
	export let builder: Builder | undefined = undefined;
	/**
	 * Hex code representation of color
	 */
	export let color: string;
	let className: $$Props['class'] = undefined;
	export { className as class };
	/**
	 * Whether or not to invert the "default" (black) color. This is automatically done in dark mode.
	 * However, when displayed e.g. in light mode on a dark background, you'll want to flip the color to white.
	 */
	export let invertDefault = false;

	$: label = colors.find((c) => c.value === color)?.label;
</script>

{#if builder}
	<div
		use:melt={builder}
		data-color={label}
		data-invert={invertDefault ? true : undefined}
		class={cn(
			"h-5 w-5 rounded-full focus:ring data-[state='open']:ring ring-offset-2 ring-[--color] ring-offset-background",
			className
		)}
		style:--color={color}
	/>
{:else}
	<div
		data-color={label}
		data-invert={invertDefault ? true : undefined}
		class={cn(
			"h-5 w-5 rounded-full focus:ring data-[state='open']:ring ring-offset-2 ring-[--color] ring-offset-background",
			className
		)}
		style:--color={color}
	/>
{/if}

<style lang="postcss">
	[data-color] {
		background-color: var(--color);
	}

	[data-color='Default'][data-invert] {
		background-color: #ffffff;
	}

	:global(.dark) {
		[data-color='Default'] {
			background-color: #ffffff;
		}
		[data-color='Default'][data-invert] {
			background-color: #000000;
		}
	}

	@media (prefers-color-scheme: dark) {
		[data-color='Default'] {
			background-color: #ffffff;
		}
		[data-color='Default'][data-invert] {
			background-color: #000000;
		}
	}
</style>
