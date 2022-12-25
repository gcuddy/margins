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
	import { goto, invalidateAll } from '$app/navigation';
	import type { IconName } from '$lib/icons';
	import { modals } from '$lib/stores/modals';
	import Button from '$lib/components/Button.svelte';
	import { tweened, spring } from 'svelte/motion';

	import Icon from '$lib/components/helpers/Icon.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import { page } from '$app/stores';
	import Sync from '$lib/components/Sync.svelte';
	import type { FavoriteWithPayload } from '$lib/types/schemas/Favorite';
	import { fade } from 'svelte/transition';
	import ColResizer from '$lib/components/ColResizer.svelte';
	import { hideSidebar } from '$lib/stores/sidebar';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import { signOut } from '@lucia-auth/sveltekit/client';
	import { sidebarFeeds, type UserStoreType } from '$lib/stores/user';
	import { readable, type Readable } from 'svelte/store';

	export let user: { username: string; email: string } | null = $page.data.user || null;

	export let favorites: FavoriteWithPayload[] = [];
	let hardcodedNav: NavItem[] = [];
	if ($page.data.user) {
		hardcodedNav = [
			{
				display: 'Bookmarks',
				href: `/u:${$page.data.user.username}/all`,
				icon: 'home',
				items: readable([
					{
						display: 'Inbox',
						href: `/u:${$page.data.user.username}/inbox`,
						icon: 'inbox',
					},
					{
						display: 'Soon',
						href: `/u:${$page.data.user.username}/soon`,
						icon: 'sparkles',
					},
					{
						display: 'Later',
						href: `/u:${$page.data.user.username}/later`,
						icon: 'calendar',
					},
					{
						display: 'Archive',
						href: `/u:${$page.data.user.username}/archive`,
						icon: 'archive',
					},
				]),
			},
			{
				display: 'Subscriptions',
				href: `/u:${$page.data.user.username}/subscriptions`,
				icon: 'rss',
				items: readable([
					{
						display: 'Unread',
						href: `/u:${$page.data.user.username}/rss/unread`,
						icon: 'unread',
						iconClass: 'text-gray-500 group-hover:text-gray-800',
					},
					{
						display: 'Podcasts',
						href: `/u:${$page.data.user.username}/rss/podcasts`,
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
				display: 'Notebook',
				href: `/u:${$page.data.user.username}/notebook`,
				icon: 'bookmarkAlt',
			},
			{
				display: 'Collections',
				href: `/u:${$page.data.user.username}/collections`,
				icon: 'rectangleStack',
			},
			{
				display: 'Views',
				href: `/u:${$page.data.user.username}/smart`,
				icon: 'square2Stack3d',
			},
		];
	}
	export let navItems = hardcodedNav;
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

	// $: $page.url.pathname.includes('entry') && hideSidebar.set(true);
	// $: $commandPaletteStore && closeSidebar();
	// $: $showCommandPalette && closeSidebar();

	export let width = 240;
	$: console.log({ width });
	let _width = width;
	// $: if ($hideSidebar) {
	// 	_width = width;
	// 	width = 0;
	// } else {
	// 	width = _width;
	// }
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

<!-- TODO: make fixed 240px on smaller widths with hamburger menu -->
<nav
	on:click={handleClick}
	on:keydown
	style="width: {width}px;"
	class="absolute z-10 flex h-full w-60 select-none flex-col space-y-3 border-r bg-gray-50 pt-10 shadow-xl transition-all duration-300 dark:border-black dark:bg-gray-800 dark:shadow-2xl lg:static lg:z-auto lg:pt-0 lg:shadow-none {$hideSidebar
		? '!absolute -translate-x-72 opacity-0'
		: 'left-0 lg:transition-none'} {sidebarToggle ? 'left-0' : '-left-full'}"
>
	<!-- splitter -->
	<div class="relative">
		<ColResizer
			class="absolute -right-1 top-0 ml-1 hidden h-screen w-3 cursor-col-resize px-1 lg:block"
			min={200}
			bind:width
		/>
	</div>
	<slot>
		<div class="flex shrink-0 flex-col items-stretch space-y-3 px-5 ">
			<div class="flex items-center justify-between">
				{#if user}
					<ContextMenu
						items={[
							[
								{
									label: 'Logout',
									perform: async () => {
										await signOut();
										invalidateAll();
									},
									icon: 'logoutSolid',
								},
								{
									label: 'Settings',
									perform: async () => {
										await goto(`/u:${$page.data.user?.username}/settings`);
									},
									icon: 'cogSolid',
								},
							],
						]}
					>
						<span class="text-sm font-medium">{user?.username}</span>
					</ContextMenu>
					<div class="flex space-x-2">
						<Sync />
						<a href="/u:{$page.data.user.username}/settings" class="focus:ring">
							<Icon name="cogSolid" className="h-4 w-4 fill-current" /></a
						>
					</div>
				{:else}
					<a href="/login"><span class="text-sm font-medium">Log in</span></a>
				{/if}
			</div>
			{#if user}
				<div class="flex space-x-2">
					<!-- todo: make this work without js? -->
					<Button
						on:click={() => {
							console.log('clicked');
							// modals.open(UrlModal);
						}}
						href="/u:{user.username}/add"
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
			{/if}
		</div>
		{#if !user && $page.data.allTags}
			<div class="flex grow flex-col items-stretch space-y-1 overflow-y-auto px-5 text-sm">
				<span class="px-2">Tags</span>
				{#each $page.data.allTags as tag}
					{#if tag}
						{@const text = typeof tag === 'string' ? tag : tag.name}
						<SidebarItem display={text} href="/u:{$page.params.username}/t:{text}" icon="tag" />
					{/if}
				{/each}
			</div>
		{/if}
		<!-- navigation -->
		<div class="flex flex-col space-y-8">
			<div class="flex grow flex-col items-stretch space-y-1 overflow-y-auto px-5 text-sm">
				{#each navItems as nav}
					<SidebarItem {...nav} bind:collapsed={nav.collapsed} />
				{/each}
			</div>
			<!-- TOOD: fix favorites -->
			<!-- {#if $user.favorites?.length}
				<div
					transition:fade|local={{ duration: 200 }}
					class="flex grow flex-col items-stretch space-y-1 overflow-y-auto px-5 text-sm"
				>
					<span class="px-2">Favorites</span>
					{#each $user.favorites as favorite}
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
			{/if} -->
		</div>
	</slot>
</nav>

<style lang="postcss">
	nav {
		/* left: var(--sidebar-offset);
		@apply lg:left-0; */
	}
</style>
