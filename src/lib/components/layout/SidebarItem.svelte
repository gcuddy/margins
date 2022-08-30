<script lang="ts">
	import { page } from '$app/stores';

	import type { IconName } from '$lib/icons';
	import Icon from '../helpers/Icon.svelte';
	import type { NavItem } from './Sidebar.svelte';
	export let display: string;
	export let href: string;
	export let icon: IconName;
	export let iconClass: string;
	export let items: NavItem[] | undefined = undefined;
	let indent = 0;
	export let active: (path: string) => boolean = (path) => path === href;

	$: isActive = active($page.url.pathname);
</script>

<a
	class="group flex h-7 items-center space-x-2 rounded px-2  font-medium text-gray-700 ring-inset hover:bg-gray-200 focus-visible:ring dark:text-gray-300 dark:hover:bg-gray-700  
  {isActive && 'bg-gray-200 dark:bg-gray-700'}
  "
	sveltekit:prefetch
	draggable="false"
	{href}
>
	<Icon
		wrapper={true}
		className="w-4 h-4 {iconClass
			? iconClass
			: ` stroke-2 stroke-gray-500 group-hover:stroke-gray-800 fill-primary-50 dark:fill-transparent dark:group-hover:fill-transparent group-hover:fill-primary-100 dark:group-hover:stroke-primary-100 ${
					isActive && 'stroke-gray-800 dark:stroke-gray-100'
			  } relative`}"
		name={icon}
	/>
	<span class="truncate">{display}</span></a
>
{#if items?.length}
	<div class="ml-4 space-y-0.5 border-l border-gray-500/50 pl-1.5">
		{#each items as item}
			<svelte:self {...item} indent={indent + 1} />
		{/each}
	</div>
{/if}
