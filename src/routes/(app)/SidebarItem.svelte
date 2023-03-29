<script lang="ts">
	import { page } from "$app/stores";

	import ChosenIcon from "$lib/components/ChosenIcon.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { useId } from "$lib/hooks/use-id";
	import type { IconName } from "$lib/icons";
	import type { ChosenIcon as ChosenIconType } from "$lib/types/icon";
	import { flip } from "svelte/animate";
	import type { Readable } from "svelte/store";
	import type { NavItem } from "./Sidebar.svelte";

	// TODO: use disclosure component
	// import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';

	// TODO: just get this from NavItem and destructue
	export let display: string;
	export let href: string | undefined = undefined;
	export let icon: IconName | ChosenIconType | undefined;
	export let img: string | undefined = undefined;
	export let iconClass: string = "";
	export let collapsible: boolean = false;
	export let collapsed: boolean = false;

	// local state
	let _collapsed = collapsed;

	export let items: Readable<NavItem[]> | undefined = undefined;
	let indent = 0;
	export let active: (path: string) => boolean = (path) => path === href;

	$: isActive = active($page.url.pathname);
	$: as = href ? "a" : "div";
</script>

<!-- <Button variant="ghost" class="w-full justify-start" size="sm">Test</Button> -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
	this={as}
	class="group flex h-7 !cursor-default items-center rounded-lg px-2 font-medium text-muted ring-inset transition-transform duration-200 focus-visible:ring hover:bg-sidebar-hover active:scale-95 dark:text-gray-300
  {isActive && 'bg-sidebar-hover'}
  "
	draggable="false"
	href={as === "a" ? href : undefined}
	on:click
	on:click={collapsible ? () => (_collapsed = !_collapsed) : undefined}
>
	<span class="flex items-center space-x-2 truncate">
		{#if icon}
			{#if typeof icon === "string"}
				<Icon
					wrapper={true}
					className="w-4 h-4 {iconClass
						? iconClass
						: ` stroke-muted   dark:fill-transparent dark:group-hover:fill-transparent  ${
								isActive && 'stroke-current'
						  } relative`}"
					name={icon}
				/>
			{:else}
				<ChosenIcon chosenIcon={icon} />
			{/if}
		{:else if img}
			<img src={img} class="h-4 w-4 rounded-md" alt="" />
		{/if}
		<slot>
			<span class="truncate">{display}</span>
			{#if collapsible}
				<Icon
					name="chevronUpSolid"
					direction={_collapsed ? "e" : "s"}
					className="h-4 w-4 fill-gray-500 opacity-0 group-hover:opacity-100 transition"
				/>
			{/if}
		</slot>
	</span>
	<span class="ml-auto flex items-center">
		<slot name="end" />
	</span>
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
