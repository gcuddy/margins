<script lang="ts" context="module">
	import Library from 'lucide-svelte/icons/library';
	import Rss from 'lucide-svelte/icons/rss';
	import Box from 'lucide-svelte/icons/box';
	import BookMarked from 'lucide-svelte/icons/book-marked';
	import Layers from 'lucide-svelte/icons/layers';
	type Nav = {
		active: (url: string) => boolean;
		href: (username: string) => string;
		icon: ComponentType;
		label: string;
	};
	export const navItems: Array<Nav> = [
		{
			active: (path) => path.endsWith('/backlog'),
			href: (username: string) => `/u:${username}/backlog`,
			icon: Library,
			label: 'Library',
		},
		{
			active: (url) => url.endsWith('/subscriptions'),
			href: (username: string) => `/u:${username}/subscriptions`,
			icon: Rss,
			label: 'Subscriptions',
		},
		{
			active: (path) => path.endsWith('/collections'),
			href: (username: string) => `/u:${username}/collections`,
			icon: Box,
			label: 'Collections',
		},
		{
			active: (url) => url.endsWith('/notebook'),
			href: (username: string) => `/u:${username}/notebook`,
			icon: BookMarked,
			label: 'Notebook',
		},
		{
			active: (url) => url.endsWith('/views'),
			href: (username: string) => `/u:${username}/views`,
			icon: Layers,
			label: 'Views',
		},
	];
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ColResizer from './col-resizer.svelte';
	import AddURLDialog from '../entries/add-url-dialog.svelte';
	import { Avatar, Button, Dropdown, Separator } from '@margins/ui';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Search from 'lucide-svelte/icons/search';
	import type { ComponentProps, ComponentType } from 'svelte';
	import { cn } from '@margins/lib';
	import AddCombobox from './add-combobox.svelte';
	import PanelLeftClose from 'lucide-svelte/icons/panel-left-close';
	import PanelLeftRight from 'lucide-svelte/icons/panel-right-close';
	import SidebarPins from './sidebar-pins.svelte';

	export let width = 240;
	export let onResize: ComponentProps<ColResizer>['onResize'] = undefined;
	export let onToggleSidebar: (open: boolean) => void = () => {};
	export let isSidebarVisible = true;
</script>

<nav class="relative flex h-full flex-col">
	<!-- Username + Avatar + Search -->
	<div class="px-3 pt-2">
		<div class="flex h-10 w-full items-center justify-between">
			<span class="flex">
				<Dropdown.Root>
					<Dropdown.Trigger
						class="hover:bg-glass/5 data-[state=open]:bg-glass/5 flex items-center gap-2 rounded-lg p-1.5"
					>
						<Avatar.Root class="h-6 w-6">
							<Avatar.Image src={$page.data.user?.avatar} alt="avatar" />
							<Avatar.Fallback class="text-xs">
								{$page.data.user?.username?.[0]?.toUpperCase()}
							</Avatar.Fallback>
						</Avatar.Root>
						<span class="text-sm font-medium">{$page.data.user?.username}</span>
						<ChevronDown class="text-muted-foreground h-4 w-4" />
					</Dropdown.Trigger>
					<Dropdown.Content
						transitionConfig={{
							duration: 75,
							start: 0.97,
							x: 0,
							y: -1,
						}}
					>
						<!-- <Dropdown.Item>Profile</Dropdown.Item>
						<Dropdown.Item>Settings</Dropdown.Item> -->
						<Dropdown.Item on:click={() => goto('/logout')}
							>Logout</Dropdown.Item
						>
					</Dropdown.Content>
				</Dropdown.Root>
			</span>

			<Button
				href="/u:{$page.data.user?.username}/search"
				variant="ghost"
				size="icon"
			>
				<Search class="text-muted-foreground h-4 w-4" />
			</Button>
		</div>
	</div>

	<div class="my-2 px-3">
		<div class="flex w-full flex-1 items-center">
			<AddURLDialog
				showButton={true}
				class="grow justify-start rounded-r-none border-r-0"
			/>
			<Separator class="h-8 lg:flex" orientation="vertical" />
			<!-- <Button variant="outline" size="sm"><ChevronDown /></Button> -->
			<AddCombobox />
		</div>
	</div>

	<!-- Navigation -->
	<div class="mb-1 mt-3 grow space-y-2 overflow-y-auto rounded px-3">
		<div class="pb-2">
			{#each navItems as { active, href, icon, label }}
				{@const isActive = active($page.url.pathname)}
				<Button
					variant="ghost"
					class={cn(
						'group my-px w-full justify-start rounded text-left text-[13px] font-medium',
						isActive && 'bg-accent text-accent-foreground',
					)}
					size="sm"
					href={href($page.data.user?.username ?? '')}
				>
					<svelte:component
						this={icon}
						class={cn(
							'text-muted-foreground/80 group-hover:text-accent-foreground mr-2.5 h-4 w-4',
							isActive && 'text-accent-foreground',
						)}
					/>
					{label}
				</Button>
			{/each}
		</div>
		<div class="pb-2">
			<span class="text-muted-foreground pl-3 text-sm font-medium"> Pins </span>
			<SidebarPins />
		</div>
	</div>
	<div class="fixed bottom-4 left-4">
		<Button
			class="group"
			variant="ghost"
			size="icon"
			on:click={() => {
				isSidebarVisible = !isSidebarVisible;
				if (isSidebarVisible) {
					onToggleSidebar(true);
				} else {
					onToggleSidebar(false);
				}
			}}
		>
			<svelte:component
				this={isSidebarVisible ? PanelLeftClose : PanelLeftRight}
				class={cn(
					'text-muted-foreground h-4 w-4 transition',
					!isSidebarVisible ? 'opacity-50 group-hover:opacity-100' : '',
				)}
			/>
			<span class="sr-only">Toggle Sidebar</span>
		</Button>
	</div>

	<ColResizer
		min={220}
		max={330}
		class="before:bg-border absolute inset-y-0 -right-[3px] z-[97] w-2 cursor-col-resize before:absolute before:inset-y-0 before:left-1 before:z-[-1] before:w-0.5 before:opacity-0 before:transition hover:before:opacity-100 data-[is-dragging=true]:before:opacity-100"
		{onResize}
		bind:width
	/>
</nav>
