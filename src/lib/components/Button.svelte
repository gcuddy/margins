<script lang="ts">
	import type { IconName } from '$lib/icons';
	import { createPopperActions } from 'svelte-popperjs';
	import { fly } from 'svelte/transition';
	import ButtonTooltip from './ButtonTooltip.svelte';
	import Icon from './helpers/Icon.svelte';

	interface Tooltip {
		text: string;
		kbd?: string;
	}

	export let type: 'submit' | 'reset' | 'button' = 'button';
	export let disabled: boolean = false;
	export let className = '';
	export let scaleOnHover = false;
	export let squishy = false;
	export let tooltip: Tooltip | undefined = undefined;
	export let prefetch = true;

	/**readonly*/
	export let el: HTMLElement | undefined = undefined;

	const [popperRef, popperContent] = createPopperActions({
		placement: 'bottom',
		strategy: 'fixed',
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 8],
				},
			},
		],
	});

	export let variant: 'primary' | 'ghost' | 'confirm' | 'link' | 'dashed' | 'transparent' =
		'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let color: 'primary' | 'ghost' | undefined = undefined;

	export let as: string = 'button';

	export let href: string | undefined = undefined;

	$: _classname = `relative flex h-7 shrink-0 cursor-default select-none appearance-none items-center justify-center truncate rounded-lg transition font-medium shadow-sm focus-visible:ring disabled:opacity-60 ${
		squishy ? 'active:scale-95 transition duration-300' : ''
	}  ${scaleOnHover ? 'hover:scale-105' : ''}
    ${size === 'md' ? 'text-sm px-2' : size === 'sm' ? 'text-xs px-2' : 'text-base p-4'}
    ${
			variant === 'ghost'
				? 'border border-gray-300 bg-white dark:bg-gray-700 text-gray-600 hover:border-gray-300  hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:text-gray-300  dark:hover:text-gray-200'
				: ''
		}
    ${
			variant === 'confirm' &&
			'border bg-lime-200 border-lime-400 hover:bg-lime-300 hover:border-lime-500 dark:bg-lime-700 hover:dark:bg-lime-600'
		}
    ${
			variant === 'primary' &&
			'bg-amber-300 dark:bg-amber-700 dark:text-amber-50 hover:bg-amber-200 dark:hover:bg-amber-600 text-amber-900'
		}
    ${variant === 'link' && 'bg-transparent shadow-none'}
    ${
			variant === 'dashed' &&
			'bg-transparent shadow-none border border-dashed dark:border-gray-500 dark:text-gray-200 dark:hover:text-gray-50'
		}
    ${
			variant === 'transparent' &&
			'bg-white/20 hover:bg-white/30 focus:bg-white/30 text-gray-900 dark:text-gray-50'
		}
    ${className}`;

	let tooltip_visible = false;
	let tooltip_timeout: ReturnType<typeof setTimeout> | undefined;
	function showTooltip() {
		// show tooltip after 300 msecond delay
		tooltip_timeout = setTimeout(() => {
			tooltip_visible = true;
		}, 500);
	}
	function hideTooltip() {
		clearTimeout(tooltip_timeout);
		tooltip_visible = false;
	}

	// TODO: tooltips
</script>

<!-- TODO: don't repeat these damn classes! -->

{#if as === 'a'}
	<!-- this is a monstrosity but use actions can't be applied conditionally; should probably wrap the action myself -->
	{#if tooltip}
		<a
			bind:this={el}
			{href}
			data-sveltekit-prefetch={prefetch ? true : undefined}
			use:popperRef
			on:click
			on:click={hideTooltip}
			on:mouseenter
			on:mouseleave
			on:mouseenter={showTooltip}
			on:mouseleave={hideTooltip}
			class={_classname}
			aria-label={tooltip.text}
		>
			<slot>Button</slot>
		</a>
	{:else}
		<a
			bind:this={el}
			{href}
			data-sveltekit-prefetch={prefetch ? true : undefined}
			on:click
			on:click={hideTooltip}
			on:mouseenter
			on:mouseleave
			on:mouseenter={showTooltip}
			on:mouseleave={hideTooltip}
			class={_classname}
		>
			<slot>Button</slot>
		</a>
	{/if}
{:else if tooltip}
	<svelte:element
		this={as}
		bind:this={el}
		type={as === 'button' ? type : undefined}
		{disabled}
		{href}
		on:click
		on:click={hideTooltip}
		on:mouseenter
		on:mouseleave
		use:popperRef
		on:mouseenter={showTooltip}
		on:mouseleave={hideTooltip}
		class={_classname}
		aria-label={tooltip.text}
	>
		<slot>Button</slot>
	</svelte:element>
{:else}
	<svelte:element
		this={as}
		bind:this={el}
		type={as === 'button' ? type : undefined}
		{disabled}
		{href}
		on:click
		on:click={hideTooltip}
		on:mouseenter
		on:mouseleave
		on:mouseenter={showTooltip}
		on:mouseleave={hideTooltip}
		class={_classname}
	>
		<slot>Button</slot>
	</svelte:element>
{/if}

{#if tooltip && tooltip_visible}
	<!-- todo: add delay -->
	<div use:popperContent class="z-50">
		<div transition:fly={{ y: 5, duration: 150 }}>
			<ButtonTooltip {...tooltip} />
		</div>
	</div>
{/if}
