<script lang="ts">
	import { page } from "$app/stores";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import type { NavItem } from "./Sidebar.svelte";
	import SidebarItem from "./SidebarItem.svelte";

	const sidebarItems: NavItem[] = [
		{
			display: "Profile",
			href: `/settings/profile`,
			// href: `/u:${$page.data.user?.username}/settings/profile`,
		},
		{
			display: "Appearance",
			href: `/settings/appearance`,
			// href: `/u:${$page.data.user?.username}/settings/profile`,
		},
		{
			display: "Stylesheets",
			href: `/settings/stylesheets`,
		},
		{
			display: "States",
			href: `/settings/states`,
		},
		{
			display: "Colors",
			href: `/settings/colors`,
		},
		{
			display: "Integrations",
			href: `/settings/integrations`,
		},
	];
</script>

<div class="flex h-16 items-center  p-5">
	<a href="/" class="flex gap-2">
		<Icon name="chevronLeftMini" className="h-4 w-4 fill-current" />
		<span class="font-medium">Settings</span></a
	>
</div>
<!-- <div class="flex flex-col overflow-y-auto px-6 pt-3 pb-6">rest</div> -->
<div class="flex flex-col space-y-8">
	<div class="flex grow flex-col items-stretch space-y-1 overflow-y-auto px-5 text-sm">
		{#each sidebarItems as nav}
			<SidebarItem {...nav} bind:collapsed={nav.collapsed} />
		{/each}
	</div>
</div>
