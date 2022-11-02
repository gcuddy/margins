<script lang="ts">
	import { page } from '$app/stores';

	import type { IconName } from '$lib/icons';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import type { NavItem } from './Sidebar.svelte';
	import { slide } from 'svelte/transition';
	import type { Readable } from 'svelte/store';
	import { map } from 'zod';
	import { useId } from '$lib/hooks/use-id';
	import { flip } from 'svelte/animate';

	// TODO: use disclosure component
	// import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';

	// TODO: just get this from NavItem and destructue
	export let display: string;
	export let href: string;
	export let icon: IconName | undefined;
	export let img: string | undefined = undefined;
	export let iconClass: string = '';
	export let collapsible: boolean = false;
	export let collapsed: boolean = false;

	// local state
	let _collapsed = collapsed;

	export let items: Readable<NavItem[]> | undefined = undefined;
	let indent = 0;
	export let active: (path: string) => boolean = (path) => path === href;

	$: isActive = active($page.url.pathname);
	$: as = href ? 'a' : 'div';
</script>

<svelte:element
	this={as}
	class="group flex h-7 items-center space-x-2 rounded-lg px-2 font-medium text-gray-700 ring-inset  transition-transform duration-200 hover:bg-gray-200 focus-visible:ring active:scale-95 dark:text-gray-300 dark:hover:bg-gray-600/50
  {isActive && 'bg-gray-200 dark:bg-gray-600 shadow dark:hover:!bg-gray-600'}
  "
	data-sveltekit-prefetch={as === 'a' ? '' : undefined}
	draggable="false"
	{href}
	on:click={collapsible ? () => (_collapsed = !_collapsed) : undefined}
>
	{#if icon}
		<Icon
			wrapper={true}
			className="w-4 h-4 {iconClass
				? iconClass
				: ` stroke-2 stroke-gray-500 group-hover:stroke-gray-800 fill-primary-50 dark:fill-transparent dark:group-hover:fill-transparent group-hover:fill-primary-100 dark:group-hover:stroke-primary-100 ${
						isActive && 'stroke-gray-800 dark:stroke-gray-100'
				  } relative`}"
			name={icon}
		/>
	{:else if img}
		<img src={img} class="h-4 w-4 rounded-md" alt="" />
	{/if}
	<span class="truncate">{display}</span>
	{#if collapsible}
		<Icon
			name="chevronUpSolid"
			direction={_collapsed ? 'e' : 's'}
			className="h-4 w-4 fill-gray-500 opacity-0 group-hover:opacity-100 transition"
		/>
	{/if}
</svelte:element>
{#if $items?.length && !_collapsed}
	<div class="ml-4 space-y-0.5 border-l border-gray-500/25 pl-1.5">
		{#each $items.map((i) => ({ ...i, id: useId() })) as item (item.id)}
			<div animate:flip>
				<svelte:self {...item} indent={indent + 1} />
			</div>
		{/each}
	</div>
{/if}
