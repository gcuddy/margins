<script lang="ts">
	import { colors } from '.';
	import { cn } from '$lib/utils';
	import { melt } from '@melt-ui/svelte';
	import type { Builder } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		color: string;
		builder?: Builder;
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

	$: label = colors.find((c) => c.value === color)?.label;
</script>

{#if builder}
	<div
		use:melt={builder}
		data-color={label}
		class={cn(
			"h-5 w-5 rounded-full focus:ring data-[state='open']:ring ring-offset-2 ring-[--color] ring-offset-background",
			className
		)}
		style:--color={color}
	/>
{:else}
	<div
		data-color={label}
		class={cn(
			"h-5 w-5 rounded-full focus:ring data-[state='open']:ring ring-offset-2 ring-[--color] ring-offset-background",
			className
		)}
		style:--color={color}
	/>
{/if}

<style>
	[data-color] {
		background-color: var(--color);
	}

	:global(.dark) [data-color='Default'] {
		background-color: #ffffff;
	}

	@media (prefers-color-scheme: dark) {
		[data-color='Default'] {
			background-color: #ffffff;
		}
	}
</style>
