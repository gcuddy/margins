<script context="module" lang="ts">
	export type TagVariant = 'primary' | 'ghost';
	// export type TagVariant = 'primary' | 'secondary' | 'ghost';
</script>

<script lang="ts">
	import type { Tag } from '@prisma/client';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{
		delete: Tag;
	}>();
	import Icon from '../helpers/Icon.svelte';
	// all we use here is name...
	export let tag: {
		name: string;
	};
	console.log({ tag });
	export let variant: TagVariant = 'primary';
	// export let icon: StoredComponent | null = null;
	export let icon = false;
	export let delIcon = false;
	export let active = false;
	export let link = true;
	export let tabindex = -1;
	export let as = 'a';
</script>

<svelte:element
	this={as}
	data-sveltekit-prefetch
	class="leading-sm inline-flex h-6 w-max min-w-fit max-w-[112px] cursor-default items-center justify-center gap-1 overflow-hidden rounded-full font-medium  transition
  {icon ? 'pr-2 pl-1.5' : 'px-2'}
  {variant === 'primary'
		? 'bg-primary-200 text-primary-900'
		: // ghost
		  'dark:hover:bg-gray-700 border border-gray-200  text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-700 dark:text-gray-400'}
    {active ? '!bg-indigo-200 !text-indigo-900' : ''}
    "
	href={as === 'a' ? `/tags/${tag.name}` : undefined}
	{tabindex}
>
	{#if icon}
		<!-- Heroicons solid Tag (TODO: make it be in a component) -->
		<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
				clip-rule="evenodd"
			/>
		</svg>
	{/if}
	<span>{tag.name}</span>
	{#if delIcon}
		<button
			on:click={(e) => {
				e.preventDefault();
				dispatch('delete', tag);
			}}
			class="h-full border-l border-transparent pl-1 hover:border-gray-300"
		>
			<Icon name="xSolid" className="h-3 w-3 fill-current" /></button
		>
	{/if}
</svelte:element>
