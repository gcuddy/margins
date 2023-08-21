<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { colors } from './constants';
	import { builderActions, type Builder } from 'bits-ui';
	import { cn } from '$lib/utils';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		color: string;
        builders?: Builder[];
	};

	/**
	 * Optional builder for @melt-ui
	 */
	export let builders: Builder[] = [];
	/**
	 * Hex code representation of color
	 */
	export let color: string;
	let className: $$Props['class'] = undefined;
	export { className as class };

	$: label = colors.find((c) => c.value === color)?.label;
</script>

{#if builders.length}
	<div
		use:builderActions={{ builders }}
		data-color={label}
		class={cn(
			"h-5 w-5 rounded-full focus:ring data-[state='open']:ring ring-offset-2 ring-[--color]",
			className
		)}
		style:--color={color}
	/>
{:else}
	<div
		data-color={label}
		class={cn(
			"h-5 w-5 rounded-full focus:ring data-[state='open']:ring ring-offset-2 ring-[--color]",
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
