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

	export const favoritesQuery = (init?: TRPCClientInit) =>
		({
			// REVIEW: should key include user? should this just be in user.data in layout.server? many questions!
			queryKey: ["favorites"] as const,
			queryFn: async () => await trpc(init).favorites.list.query(),
		} satisfies CreateQueryOptions);
</script>

<script lang="ts">
	import { goto, invalidateAll } from "$app/navigation";
	import type { IconName } from "$lib/icons";
	import { modals } from "$lib/stores/modals";
	import Button from "$lib/components/Button.svelte";
	import { tweened, spring } from "svelte/motion";

	import Icon from "$lib/components/helpers/Icon.svelte";
	import SidebarItem from "./SidebarItem.svelte";
	import { page } from "$app/stores";
	import Sync from "$lib/components/Sync.svelte";
	import type { FavoriteWithPayload } from "$lib/types/schemas/Favorite";
	import { fade } from "svelte/transition";
	import ColResizer from "$lib/components/ColResizer.svelte";
	import { hideSidebar } from "$lib/stores/sidebar";
	import ContextMenu from "$lib/components/ContextMenu.svelte";
	import { sidebarFeeds, type UserStoreType } from "$lib/stores/user";
	import { readable, type Readable } from "svelte/store";
	import { checkIfKeyboardShortcutsAllowed } from "$lib/stores/keyboard";
	import { backInOut, backOut, bounceOut, cubicOut, elasticOut, quadOut, quintOut } from "svelte/easing";
	import mq from "$lib/stores/mq";
	import { Menu, MenuButton, MenuItem, MenuItems } from "@rgossiaux/svelte-headlessui";
	import { createPopperActions } from "svelte-popperjs";
	import { podcastPlayer } from "$lib/components/PodcastPlayer.svelte";
	import DotMenu from "$lib/components/DotMenu.svelte";
	import MiniPlayer from "./MiniPlayer.svelte";
	import MenuItemsContainer from "$lib/components/ui/Menu/MenuItemsContainer.svelte";
	import { createQuery, CreateQueryOptions } from "@tanstack/svelte-query";
	import { trpc } from "$lib/trpc/client";
	import { dndzone } from "svelte-dnd-action";
	import SidebarFavorites from "./SidebarFavorites.svelte";
	import type { TRPCClientInit } from "trpc-sveltekit";

	export let user: { username: string; email: string } | null = $page.data.user || null;

	export let favorites: FavoriteWithPayload[] = [];
	let hardcodedNav: NavItem[] = [];
	if ($page.data.user) {
		hardcodedNav = [
			{
				display: "Library",
				href: `/u:${$page.data.user.username}/all`,
				icon: "buildingLibrary",
				items: readable([
					{
						display: "Inbox",
						href: `/u:${$page.data.user.username}/inbox`,
						icon: "inbox",
					},
					{
						display: "Soon",
						href: `/u:${$page.data.user.username}/soon`,
						icon: "sparkles",
					},
					{
						display: "Later",
						href: `/u:${$page.data.user.username}/later`,
						icon: "calendar",
					},
					{
						display: "Archive",
						href: `/u:${$page.data.user.username}/archive`,
						icon: "archive",
					},
				]),
			},
			{
				display: "Subscriptions",
				href: `/u:${$page.data.user.username}/subscriptions`,
				icon: "rss",
				items: readable([
					{
						display: "All Entries",
						href: `/u:${$page.data.user.username}/subscriptions/all`,
						icon: "inbox",
						iconClass: "text-gray-500 group-hover:text-gray-800",
					},
					{
						display: "Podcasts",
						href: `/u:${$page.data.user.username}/subscriptions/podcasts`,
						icon: "microphone",
					},
					{
						display: "Subscriptions",
						icon: "rss",
						collapsible: true,
						collapsed: true,
						items: sidebarFeeds,
					},
				]),
			},
			{
				display: "Notebook",
				href: `/u:${$page.data.user.username}/notebook`,
				icon: "bookmarkAlt",
			},
			{
				display: "Collections",
				href: `/u:${$page.data.user.username}/collections`,
				icon: "rectangleStack",
			},
			{
				display: "Views",
				href: `/u:${$page.data.user.username}/smart`,
				icon: "square3Stack3d",
			},
			{
				display: "Log",
				href: `/u:${$page.data.user.username}/log`,
				icon: "lightningBolt",
			},
			{
				display: "Garden",
				href: `/u:${$page.data.user.username}/garden`,
				icon: "sprout",
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
		// collapse();
		sidebarToggle = false;
		left.set(-300);
	};

	const toggleSidebar = () => {
		// sidebarToggle = !sidebarToggle;
		// left.set(sidebarToggle ? 0 : -300);
		if (checkIfKeyboardShortcutsAllowed()) {
			if ($tweenedWidth) {
				collapse();
			} else {
				expand();
			}
		}
		// () => left.update((l) => (l === 0 ? -300 : 0))
	};

	function handleClick(e: MouseEvent) {
		console.log("[Sidebar] click", e);
	}

	// TODO: close sidebar when clicking button or link inside nav
	// (this would be when page.path or modals change (as of now; this seems hacky))
	$: $page.url, closeSidebar();
	$: $modals.length && closeSidebar();

   $: $page.url, $mq.max_lg && collapse();
	// $: $page.url.pathname.includes('entry') && hideSidebar.set(true);
	// $: $commandPaletteStore && closeSidebar();
	// $: $showCommandPalette && closeSidebar();

	export let width = 240;
	$: console.log({ width });
	let _width = width
    $: console.log({$mq})

    let lgCollapsed = false;
    $: $mq.max_lg && collapse();
    $: $mq.lg && !lgCollapsed && expand();

    // mq.subscribe(val => {
    //     val.
    // })
	const tweenedWidth = tweened(width, {
		duration: 600,
		easing: quintOut,
	});
	const tweenedLeft = tweened(0, {
		duration: 600,
		easing: quintOut,
	});
	const tweenedTop = tweened(0, {
		duration: 600,
		easing: quintOut,
	});

	export let sidebarWidth = $tweenedWidth;

	$: $tweenedWidth, (sidebarWidth = $tweenedWidth);

	let ticking = false;
	$: width,
		!show_floating &&
			!collapsed &&
			!ticking &&
			tweenedWidth.set(width, {
				duration: 0,
			});

	export let collapsed = false;

	const leftSize = () => width * -1.1;

	function collapse() {
		if (collapsed) return;
        if ($mq.lg) {
            lgCollapsed = true;
        }
		show_floating = false;
		Promise.all([
			tweenedWidth.set(0),
			tweenedLeft.set(leftSize()),
			tweenedTop.set(56, {
				// delay: 100,
			}),
		]).then(() => (collapsed = true));
	}

	function expand() {
		if (!collapsed) return;
        if ($mq.lg) {
            lgCollapsed = false;
        }
		ticking = true;
		show_floating = false;
		collapsed = false;
		Promise.all([tweenedWidth.set(width), tweenedLeft.set(0), tweenedTop.set(0)]).then(
			() => (ticking = false)
		);
	}

	let show_floating = false;

	function customBackOut(t: number) {
		const s = 0.7;
		return --t * t * ((s + 1) * t + s) + 1;
	}

	function showFloating() {
		if (show_floating) return;
		tweenedLeft
			.set(0, {
				duration: 400,
				easing: quintOut,
			})
			.then(() => {
				show_floating = true;
			});
	}
	function hideFloating() {
		if (!show_floating) return;
		tweenedLeft.set(leftSize());
		show_floating = false;
	}

	const [addMenuRef, addMenuContent] = createPopperActions({
		placement: "bottom-end",
	});

	const favoriteQuery = createQuery(favoritesQuery($page));
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

<svelte:window
	on:keydown={(e) => {
		if (e.key === "[" && !e.metaKey && !e.shiftKey && !e.ctrlKey) {
			if (checkIfKeyboardShortcutsAllowed()) {
				if ($tweenedWidth) {
					collapse();
				} else {
					expand();
				}
			}
		}
	}}
/>
{#if show_floating || ($mq.max_md && $tweenedWidth)}
	<div
		class="fixed inset-0 z-30 bg-transparent"
		on:mouseenter={() => {
			console.log("mousenter");
			if (show_floating) hideFloating();
			// tweenedLeft.set(-350).then(() => (show_floating = false));
		}}
		on:click={collapse}
	/>
{/if}
<div>
	<!-- {show_floating} -->
	<button
		class="fixed top-0 left-0 z-20 !mt-0 flex h-14 w-12 cursor-default flex-col items-center justify-center p-0.5 pl-2 focus-visible:text-blue-500 lg:hidden"
		on:click={toggleSidebar}
	>
		<Icon name="menu" className="h-5 w-5 stroke-2 stroke-current" />
		<span class="sr-only">Toggle menu</span>
	</button>

	<!-- Spacer which has width when big enough, otherwise 0 -->
	<div style:--width="{$tweenedWidth}px" class="w-0 md:w-[var(--width)]" />

	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<div
		style="width: 12px;position: fixed;left: 0;height: 100%; z-index:2;"
		on:mouseover={() => {
			console.log("MOUSEOVER");
			console.log({ $tweenedWidth, show_floating });
			if ($tweenedWidth || show_floating) return;
			showFloating();
		}}
	/>
	<!-- TODO: make fixed 240px on smaller widths with hamburger menu -->
	<div
		style:--top="{$tweenedTop}px"
		style="width: {width}px; left: {$tweenedLeft}px"
		class="fixed bottom-0 top-0 z-40 md:top-[var(--top)]"
	>
		<!-- TODO: sidebarColor css variable (for theming) -->
		<nav
			on:click={handleClick}
			on:keydown
			class="relative flex h-full max-w-[min(100vw-40px,400px)] grow  flex-col space-y-3  border-border bg-sidebar pt-10 shadow-xl transition   duration-300 dark:shadow-2xl lg:pt-0 lg:shadow-none {collapsed
				? '-top-2 m-1 rounded-md border  dark:border-gray-600 dark:bg-gray-800'
				: 'border-r '}"
		>
			<!-- splitter -->
			<ColResizer
				class="absolute -right-1 top-0 ml-1 hidden h-screen w-3 cursor-col-resize px-1 lg:block"
				min={200}
				on:collapse={collapse}
				bind:width
			/>
			<slot>
				<div class="flex shrink-0 flex-col items-stretch space-y-3 overflow-y-auto px-5 ">
					<div class="flex items-center justify-between">
						{#if user}
							<ContextMenu
								items={[
									[
										{
											label: "Logout",
											perform: async () => {
												await fetch(`/u:${user?.username}?/signout`, {
													method: "POST",
													headers: {
														"x-sveltekit-action": "true",
                                                        // content-type
                                                        "Content-Type": "application/x-www-form-urlencoded"
													},
                                                    body: null,
												});
												await invalidateAll();
												await goto('/');
											},
											icon: "logoutSolid",
										},
										{
											label: "Settings",
											perform: async () => {
												await goto(`/settings`);
											},
											icon: "cogSolid",
										},
									],
								]}
							>
								<span class="text-sm font-medium">{user?.username}</span>
							</ContextMenu>
							<div class="flex space-x-2">
								<Sync />
								<a href="/settings" class="focus:ring">
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
							<div class="flex grow gap-[1px]">
								<Button
									on:click={() => {
										console.log("clicked");
										// modals.open(UrlModal);
									}}
									href="/u:{user.username}/add"
									as="a"
									size="sm"
									variant="ghost"
									className="space-x-2 grow rounded-r-none"
								>
									<Icon name="plusCircle" className="h-4 w-4 stroke-2 stroke-current" />
									<div class="flex grow">Add URL</div>
								</Button>
								<Menu class="flex items-center">
									<MenuButton
										use={[addMenuRef]}
										class="relative flex h-7 shrink-0 cursor-default select-none appearance-none  items-center justify-center truncate rounded-lg rounded-l-none border border-gray-300  bg-white
									p-1 font-medium text-gray-600 shadow-sm transition focus-visible:ring disabled:opacity-60 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-200"
									>
										<Icon name="chevronDownMini" className="h-4 w-4 fill-gray-400" />
									</MenuButton>
									<MenuItems
										class="z-20 mt-2 flex w-56 origin-top-right scale-100 transform flex-col gap-1  rounded-md bg-gray-50/90 p-2 py-1 opacity-100 shadow-xl ring-1 ring-black/5 backdrop-blur-sm focus:outline-none  dark:divide-gray-700 dark:bg-zinc-900/50 dark:text-current dark:ring-gray-400/20 dark:backdrop-blur-md dark:backdrop-brightness-75 dark:backdrop-contrast-75 dark:backdrop-saturate-200"
										use={[addMenuContent]}
									>
										<MenuItem
											class={({ active }) =>
												`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
													active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
												}`}
										>
											<Icon name="rssMini" className="fill-gray-400 h-4 w-4" />
											<span>Add subscription</span>
										</MenuItem>
										<MenuItem
											href="/podcasts/search"
											class={({ active }) =>
												`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
													active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
												}`}
										>
											<Icon name="microphoneMini" className="fill-gray-400 h-4 w-4" />
											<span>Add podcast</span>
										</MenuItem>
										<MenuItem
											href="/books/search"
											class={({ active }) =>
												`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
													active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
												}`}
										>
											<Icon name="bookOpenMini" className="fill-gray-400 h-4 w-4" />
											<span>Add book</span>
										</MenuItem>
										<MenuItem
											href="/movies/search"
											class={({ active }) =>
												`flex h-8 cursor-default select-none items-center space-x-3 rounded-lg px-2 text-sm font-medium text-gray-900 dark:text-gray-50 ${
													active ? "bg-primary-300/30 dark:bg-gray-500/20" : ""
												}`}
										>
											<Icon name="playCircleMini" className="fill-gray-400 h-4 w-4" />
											<span>Add movie or TV show</span>
										</MenuItem>
									</MenuItems>
								</Menu>
							</div>

							<Button
								on:click={() => goto(`/u:${$page.data.user?.username}/search`)}
								size="sm"
								variant="ghost"
							>
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
								{@const text = typeof tag === "string" ? tag : tag.name}
								<SidebarItem on:click={() => {
                                    if ($mq.max_lg) collapse();
                                }} display={text} href="/u:{$page.params.username}/t:{text}" icon="tag" />
							{/if}
						{/each}
					</div>
				{/if}
				<!-- navigation -->
				<div class="simple-scrollbar flex shrink flex-col space-y-8 overflow-y-auto">
					<div class="flex grow flex-col items-stretch space-y-1 px-5 text-sm">
						{#each navItems as nav}
							<SidebarItem on:click={() => {
                                console.log("click")
                                if ($mq.max_lg) collapse();
                            }} {...nav} bind:collapsed={nav.collapsed} />
						{/each}
					</div>
					<!-- TOOD: fix favorites -->
					{#if $favoriteQuery.isSuccess && $favoriteQuery.data}
						<SidebarFavorites favorites={$favoriteQuery.data} />
					{/if}
				</div>
				{#if $podcastPlayer.loaded}
					<MiniPlayer />
				{/if}
			</slot>
		</nav>
	</div>
</div>
