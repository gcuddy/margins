<script lang="ts">
	import type { IconName } from '$lib/icons';
	import Icon from './helpers/Icon.svelte';

	export let type: 'submit' | 'reset' | 'button' = 'button';
	export let disabled: boolean = false;
	export let className = '';

	export let variant: 'primary' | 'ghost' | 'confirm' | 'link' | 'dashed' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';

	/** whether or not to style on hover */
	export let hover = true;

	export let as: string = 'button';

	export let href: string | undefined = undefined;

	$: _classname = `relative flex h-7 shrink-0 cursor-default select-none appearance-none items-center justify-center truncate rounded px-2 font-medium shadow-sm focus-visible:ring disabled:opacity-60 
  ${size === 'md' ? 'text-sm' : size === 'sm' ? 'text-xs' : 'text-base'}  
    ${
			variant === 'ghost' &&
			'border border-gray-300 bg-white dark:bg-gray-700 text-gray-600 hover:border-gray-300  hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:text-gray-300  dark:hover:text-gray-200'
		}
    ${
			variant === 'confirm' &&
			'border bg-lime-200 border-lime-400 hover:bg-lime-300 hover:border-lime-500 dark:bg-lime-700 hover:dark:bg-lime-600'
		}
    ${variant === 'primary' && 'bg-amber-300 dark:bg-amber-600 dark:text-amber-50 text-amber-900'}
    ${variant === 'link' && 'bg-transparent shadow-none'}
    ${variant === 'dashed' && 'bg-transparent shadow-none border'}
${className}`;

	// TODO: tooltips
</script>

<!-- TODO: don't repeat these damn classes! -->

{#if as === 'a'}
	<a
		{href}
		sveltekit:prefetch
		on:click
		on:mouseenter
		on:mouseleave
		class="relative flex h-7 shrink-0 cursor-default select-none appearance-none items-center justify-center truncate rounded px-2 font-medium shadow-sm focus-visible:ring disabled:opacity-60 
  {size === 'md' ? 'text-sm' : size === 'sm' ? 'text-xs' : 'text-base'}  
    {variant === 'ghost' &&
			'border border-gray-300 bg-white dark:bg-gray-700 text-gray-600 hover:border-gray-300  hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:text-gray-300  dark:hover:text-gray-200'}
    {variant === 'confirm' &&
			'border bg-lime-200 border-lime-400 hover:bg-lime-300 hover:border-lime-500 dark:bg-lime-700 hover:dark:bg-lime-600'}
    {variant === 'primary' && 'bg-amber-300 dark:bg-amber-600 dark:text-amber-50 text-amber-900'}
        {variant === 'link' && 'bg-transparent shadow-none'}
        {variant === 'dashed' &&
			'bg-transparent shadow-none border border-dashed dark:border-gray-500 dark:text-gray-200 dark:hover:text-gray-50'}
{className}"
	>
		<slot>Button</slot>
	</a>
{:else}
	<svelte:element
		this={as}
		type={as === 'button' ? type : undefined}
		{disabled}
		{href}
		on:click
		on:mouseenter
		on:mouseleave
		class="relative flex h-7 shrink-0 cursor-default select-none appearance-none items-center justify-center truncate rounded px-2 font-medium shadow-sm focus-visible:ring disabled:opacity-60 
  {size === 'md' ? 'text-sm' : size === 'sm' ? 'text-xs' : 'text-base'}  
    {variant === 'ghost' &&
			'border border-gray-300 bg-white dark:bg-gray-700 text-gray-600 hover:border-gray-300  hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:text-gray-300  dark:hover:text-gray-200'}
    {variant === 'confirm' &&
			'border bg-lime-200 border-lime-400 hover:bg-lime-300 hover:border-lime-500 dark:bg-lime-700 hover:dark:bg-lime-600'}
    {variant === 'primary' && 'bg-amber-300 dark:bg-amber-600 dark:text-amber-50 text-amber-900'}
    {variant === 'link' && 'bg-transparent shadow-none'}
    {variant === 'dashed' &&
			'bg-transparent shadow-none border border-dashed dark:border-gray-500 dark:text-gray-200 dark:hover:text-gray-50'}
{className}"
	>
		<slot>Button</slot>
	</svelte:element>
{/if}
