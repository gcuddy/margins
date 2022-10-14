<script lang="ts" context="module">
	export interface NavItem {
		display: string;
		href?: string;
		icon?: IconName;
		iconClass?: string;
		img?: string;
		// defaults to active if path = href
		active?: (path: string) => boolean;
		items?: Readable<NavItem[]>;
		collapsible?: boolean;
		collapsed?: boolean;
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import type { IconName } from '$lib/icons';
	import { modals } from '$lib/stores/modals';
	import Button from '$lib/components/Button.svelte';
	import { tweened, spring } from 'svelte/motion';

	import Icon from '$lib/components/helpers/Icon.svelte';
	import UrlModal from '$lib/components/modals/URLModal.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import { page } from '$app/stores';
	import Sync from '$lib/components/Sync.svelte';
	import type { FavoriteWithPayload } from '$lib/types/schemas/Favorite';
	import { fade } from 'svelte/transition';
	import ColResizer from '$lib/components/ColResizer.svelte';
	import { hideSidebar } from '$lib/stores/sidebar';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import { signOut } from 'lucia-sveltekit/client';
	import { sidebarFeeds, type UserStoreType } from '$lib/stores/user';
	import { readable, type Readable } from 'svelte/store';

	export let user: UserStoreType;

	export let favorites: FavoriteWithPayload[] = [];
	let hardcodedNav: NavItem[];
	hardcodedNav = [
		{
			display: 'Home',
			href: '/all',
			icon: 'home',
			items: readable([
				{
					display: 'Inbox',
					href: '/inbox',
					icon: 'inbox',
				},
				{
					display: 'Soon',
					href: '/soon',
					icon: 'sparkles',
				},
				{
					display: 'Later',
					href: '/later',
					icon: 'calendar',
				},
			]),
		},
		{
			display: 'Subscriptions',
			href: '/rss',
			icon: 'rss',
			items: readable([
				{
					display: 'Unread',
					href: '/rss/unread',
					icon: 'unread',
					iconClass: 'text-gray-500 group-hover:text-gray-800',
				},
				{
					display: 'Podcasts',
					href: '/rss/podcasts',
					icon: 'microphone',
				},
				{
					display: 'Subscriptions',
					icon: 'rss',
					collapsible: true,
					collapsed: true,
					items: sidebarFeeds,
				},
			]),
		},
		{
			display: 'Lists',
			href: '/lists',
			icon: 'viewGrid',
		},
		{
			display: 'Smart Lists',
			href: '/smart',
			icon: 'collection',
		},
		{
			display: 'Notebook',
			href: '/notebook',
			icon: 'bookmarkAlt',
		},
	];

	// TODO: un hard code this
	// sidebar-offset -> hard coding this for now because i can't think of another way
	const left = tweened(-300, {
		duration: 150,
	});
	// const left = spring(-300, {
	// 	damping: 0.6
	// });
	let sidebarToggle = false;

	const closeSidebar = () => {
		sidebarToggle = false;
		left.set(-300);
	};

	const toggleSidebar = () => {
		sidebarToggle = !sidebarToggle;
		left.set(sidebarToggle ? 0 : -300);
		// () => left.update((l) => (l === 0 ? -300 : 0))
	};

	function handleClick(e: MouseEvent) {
		console.log('[Sidebar] click', e);
	}

	// TODO: close sidebar when clicking button or link inside nav
	// (this would be when page.path or modals change (as of now; this seems hacky))
	$: $page.url, closeSidebar();
	$: $modals.length && closeSidebar();
	// $: $commandPaletteStore && closeSidebar();
	// $: $showCommandPalette && closeSidebar();

	export let width = 240;
	let _width = width;
	$: if ($hideSidebar) {
		_width = width;
		width = 0;
	} else {
		width = _width;
	}
	$: console.log({ $page });
</script>

{#if sidebarToggle}
	<div class="fixed inset-0 z-10 bg-transparent" on:click={toggleSidebar} />
{/if}

<!-- Flexbox Version -->
<!-- <div
			class="relative flex h-screen h-full min-h-full w-full flex-row items-stretch overflow-hidden text-gray-800 "
		> -->
<!-- Grid: let layout take over without setting width -->

<!-- TODO: use transforms for this instead -->
<!-- toggle button -->
<button
	class="fixed top-0 left-0 z-20 !mt-0 flex h-14 w-12 cursor-default flex-col items-center justify-center p-0.5 pl-2 focus-visible:text-blue-500 lg:hidden"
	on:click={toggleSidebar}
>
	<Icon name="menu" className="h-5 w-5 stroke-2 stroke-current" />
	<span class="sr-only">Toggle menu</span>
</button>
<nav
	on:click={handleClick}
	style="width: {width}px;"
	class="absolute z-10 flex h-full w-60 select-none flex-col space-y-3 border-r bg-gray-50 pt-10 shadow-xl transition-all duration-300 dark:border-black dark:bg-gray-800 dark:shadow-2xl lg:static lg:z-auto lg:pt-0 lg:shadow-none {$hideSidebar
		? '-translate-x-72 opacity-0'
		: 'lg:transition-none left-0'} {sidebarToggle ? 'left-0' : '-left-full'}"
>
	<!-- splitter -->
	<div class="relative">
		<ColResizer
			class="absolute -right-1 top-0 ml-1 hidden h-screen w-3 cursor-col-resize px-1 lg:block"
			min={200}
			bind:width
		/>
	</div>
	<!-- Flexbox: set width -->
	<!-- <nav
				class="user-select-none relative flex min-w-max max-w-xs flex-col border-r bg-gray-400 transition-opacity lg:w-56  lg:shrink-0 "
			> -->
	<div class="flex shrink-0 flex-col items-stretch space-y-3 px-5 ">
		<div class="flex items-center justify-between">
			<ContextMenu
				items={[
					[
						{
							label: 'Logout',
							perform: async () => {
								await signOut('/');
							},
							icon: 'logoutSolid',
						},
						{
							label: 'Settings',
							perform: async () => {
								await goto('/settings');
							},
							icon: 'cogSolid',
						},
					],
				]}
			>
				<span class="text-sm font-medium">{$user.username}</span>
			</ContextMenu>
			<div class="flex space-x-2">
				<Sync />
				<a href="/settings" class="focus:ring">
					<Icon name="cogSolid" className="h-4 w-4 fill-current" /></a
				>
			</div>
		</div>
		<div class="flex space-x-2">
			<!-- todo: make this work without js? -->
			<Button
				on:click={() => {
					console.log('clicked');
					// modals.open(UrlModal);
				}}
				href="/add"
				as="a"
				size="sm"
				variant="ghost"
				className="space-x-2 grow"
			>
				<Icon name="plusCircle" className="h-4 w-4 stroke-2 stroke-current" />
				<div class="flex grow">Add URL</div>
			</Button>

			<Button on:click={() => goto('/search')} size="sm" variant="ghost">
				<Icon name="search" className="h-4 w-4 stroke-2 stroke-current" />
				<span class="sr-only">Search</span>
			</Button>
		</div>
	</div>
	<!-- navigation -->
	<div class="flex flex-col space-y-8">
		<div class="flex grow flex-col items-stretch space-y-1 overflow-y-auto px-5 text-sm">
			{#each hardcodedNav as nav}
				<SidebarItem {...nav} bind:collapsed={nav.collapsed} />
			{/each}
		</div>
		{#if $user.favorites?.length}
			<div
				transition:fade|local={{ duration: 200 }}
				class="flex grow flex-col items-stretch space-y-1 overflow-y-auto px-5 text-sm"
			>
				<span class="px-2">Favorites</span>
				{#each favorites as favorite}
					{#if favorite.tag}
						<div transition:fade>
							<SidebarItem
								display={favorite.tag.name}
								href="/tags/{favorite.tag.name}"
								icon="tag"
							/>
						</div>
					{:else if favorite.rss}
						<SidebarItem display={favorite.rss.title} href="/rss/{favorite.rss.id}" icon="rss" />
					{:else if favorite.smartList}
						<SidebarItem
							display={favorite.smartList.name}
							href="/smart/{favorite.smartList.id}"
							icon="collection"
						/>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</nav>

<style lang="postcss">
	nav {
		/* left: var(--sidebar-offset);
		@apply lg:left-0; */
	}
</style>
