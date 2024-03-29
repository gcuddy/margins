<script lang="ts" context="module">
	type Nav = {
		active: (path: string) => boolean;
		href: string;
		icon: ComponentType;
		label: string;
	};

	import { Sheet } from '$components/ui/sheet';

	export const showAddUrlModalStore = writable(false);

	export const nav: Array<Nav> = [
		// {
		// 	active: (url) => url.startsWith('/home'),
		// 	href: '/home',
		// 	icon: Home,
		// 	label: 'Home',
		// },
		{
			active: (url) => url.startsWith('/library'),
			href: '/library/backlog',
			icon: Library,
			label: 'Library',
		},
		{
			active: (url) => url.startsWith('/subscriptions'),
			href: '/subscriptions',
			icon: Rss,
			label: 'Subscriptions',
		},
		{
			active: (path) => path === '/collections',
			href: '/collections',
			icon: Box,
			label: 'Collections',
		},
		// {
		// 	active: (url) => url.startsWith('/notes'),
		// 	href: '/notes',
		// 	icon: TreePine,
		// 	label: 'Evergreens',
		// },
		{
			active: (url) => url.startsWith('/notebook'),
			href: '/notebook',
			icon: BookMarked,
			label: 'Notebook',
		},
		{
			active: (url) => url === '/views',
			href: '/views',
			icon: Layers,
			label: 'Views',
		},
		// {
		// 	active: (url) => url === '/views',
		// 	href: '/srs',
		// 	icon: BrainCircuit,
		// 	label: 'Memory Palace',
		// },
		{
			active: (url) => url.startsWith('/search'),
			href: '/search',
			icon: SearchIcon,
			label: 'Search',
		},
	];
</script>

<script lang="ts">
	import { clear } from 'idb-keyval';

	import { createAvatar, melt } from '@melt-ui/svelte';
	import {
		createQuery,
		useIsFetching,
		useIsMutating,
		useQueryClient,
	} from '@tanstack/svelte-query';
	import {
		BookMarked,
		Box,
		ChevronDownIcon,
		FolderPlus,
		FolderSync,
		// Home,
		Layers,
		Library,
		Loader,
		PinIcon,
		PlusCircle,
		Rss,
		RssIcon,
		SearchIcon,
	} from 'lucide-svelte';
	import { getContext, type ComponentType } from 'svelte';
	import { persisted } from 'svelte-local-storage-store';
	import { derived, writable, type Writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AddUrlModal from '$components/add-url/add-url-modal.svelte';
	import Pins from '$components/pins/pins.svelte';
	import SubscriptionEntry from '$components/subscriptions/subscription-entry.svelte';
	import Separator from '$components/ui/Separator.svelte';
	import * as Dialog from '$components/ui/dialog';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from '$components/ui/dropdown-menu';
	import { Skeleton } from '$components/ui/skeleton';
	import { cn } from '$lib';
	import { audioPlayer } from '$lib/components/AudioPlayer.svelte';
	import ColResizer from '$lib/components/ColResizer.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { queryFactory } from '$lib/queries/querykeys';
	import mq from '$lib/stores/mq';

	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import MobileAddMenu from '$components/nav/mobile-add-menu.svelte';
	import { showAddSubscriptionModal } from '$lib/stores/subscriptions';
	import { post } from '$lib/utils/forms';
	import type { LayoutData } from './$types';
	import { commanderState } from './Commander.svelte';
	import { useMenuBar } from './MainNav.svelte';

	let pinsComponent: Pins;

	const queryClient = useQueryClient();

	const isRestoring = getContext('isRestoring') as Writable<boolean>;
	const isMutating = useIsMutating();
	const isFetching = useIsFetching();

	const pinsQuery = createQuery(
		derived(page, ($page) => ({
			...queryFactory.pins.list(),
			enabled: !!$page.data.user_data,
		})),
	);

	const inArticle = getContext('inArticle') as Writable<boolean>;

	$: collapsed = $inArticle ? !$mq['2xl'] : !$mq.lg;

	export let user_data: LayoutData['user_data'];

	const menu_bar = useMenuBar();

	export let width = 240;

	const {
		elements: { fallback, image },
	} = createAvatar({
		src: $page.data.user_data?.avatar ?? '',
	});

	let borderBoxSize:
		| Array<{ blockSize: number; inlineSize: number }>
		| undefined
		| null;
	const mobileNavWidth = getContext('mobileNavWidth') as Writable<number>;
	$: mobileNavWidth.set(borderBoxSize?.[0]?.inlineSize ?? 81);

	export let showAddUrlModal = showAddUrlModalStore;
	const gardenEnabled = persisted('gardenEnabled', false);

	let mobileNavMenu = false;
</script>

{#if !$inArticle && user_data}
	<div
		style:--mobile-nav-width="{$mobileNavWidth}px"
		style:--width="{width}px"
		class="w-[--mobile-nav-width] lg:w-[--width]"
	/>
	<nav
		bind:borderBoxSize
		style:--width="{width}px"
		style:padding-bottom="{$audioPlayer.height}px"
		class="fixed bottom-0 left-0 top-0 flex h-full grow flex-col gap-2 overflow-y-auto overscroll-contain border-r lg:w-[--width] {$menu_bar.show
			? 'opacity-100'
			: 'opacity-0'} transition-opacity duration-500 focus-within:opacity-100 hover:opacity-100"
	>
		<div
			class="relative flex h-[--nav-height] shrink-0 items-center px-4 py-2 max-lg:justify-center"
		>
			<!-- <span class="flex text-muted-foreground items-center"><FlowerIcon class="h-6 w-6 mr-1" /> <span class="text-sm font-medium">Margins</span> </span> -->
			{#if $page.data.user_data?.username}
				<DropdownMenu>
					<DropdownMenuTrigger asChild let:builder>
						<a
							use:melt={builder}
							href="/settings"
							on:click|preventDefault
							class="flex w-fit items-center gap-x-2 rounded p-2 data-[state=open]:bg-accent"
						>
							<span
								class="relative flex shrink-0 overflow-hidden rounded-full square-8 lg:square-5"
							>
								<img
									src={$page.data.user_data.avatar}
									use:melt={$image}
									alt="avatar"
									class="aspect-square h-full w-full"
								/>
								<span
									use:melt={$fallback}
									class="flex h-full w-full items-center justify-center rounded-full bg-muted"
								>
									{$page.data.user_data.username[0]?.toUpperCase()}
								</span>
							</span>
							<span class="hidden text-sm font-medium lg:inline"
								>{$page.data.user_data.username}</span
							>
						</a>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="w-[250px] focus-visible:outline-none">
						<DropdownMenuItem on:click={() => goto('/settings')}>
							<a class="contents" href="/settings">Settings</a>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							on:click={() => {
								queryClient.clear();
								// clear idb-keyval too, because this ^^ doesn't seem to clear it
								clear();
								post('/s?/logout');
							}}
						>
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			{/if}
			{#if $isRestoring || $isMutating}
				<span
					transition:fade={{ duration: 75 }}
					class="absolute right-4 my-auto hidden lg:flex"
				>
					<Loader class="h-4 w-4 animate-spin text-muted-foreground" />
				</span>
			{/if}
		</div>
		<div class="px-4">
			<div class="flex flex-1 items-center">
				<!-- TODO: on small sizes, these should switch — the button should trigger the dropdown -->
				<Button
					on:click={() => {
						// open modal
						if ($mq.max_lg) {
							mobileNavMenu = true;
						} else {
							showAddUrlModal.set(true);
						}
					}}
					variant="outline"
					size="sm"
					class="w-full justify-center gap-x-2 lg:justify-start lg:rounded-r-none lg:border-r-0"
				>
					<PlusCircle class="shrink-0 square-5 lg:square-4" />
					<span class="hidden lg:inline">Add</span>
					<!-- TODO: create dropdown menu for type, and add Modal -->
				</Button>
				<!-- h-8 is same height as buttons -->
				<Separator class="hidden h-8 lg:flex" orientation="vertical" />
				<DropdownMenu
					positioning={{
						placement: 'bottom-end',
					}}
				>
					<DropdownMenuTrigger let:builder asChild>
						<button
							class={cn(
								buttonVariants({ size: 'sm', variant: 'outline' }),
								'hidden rounded-l-none border-l-0 px-2 lg:flex',
							)}
							use:melt={builder}
						>
							<!--  -->
							<ChevronDownIcon class="h-4 w-4 text-secondary-foreground" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="w-56">
						<DropdownMenuLabel>Add new…</DropdownMenuLabel>
						<DropdownMenuGroup>
							<DropdownMenuItem
								on:click={() => {
									$showAddSubscriptionModal = true;
								}}
							>
								<RssIcon class="mr-2 h-4 w-4" />
								<span>Subscription</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								on:click={() => {
									commanderState.update((s) => ({
										...s,
										pages: ['search-movies'],
										allowPages: false,
										placeholder: 'Search for a movie or TV show',
										isOpen: true,
									}));
								}}
							>
								<EntryIcon type="movie" class="mr-2 h-4 w-4" />
								Movie or TV Show
							</DropdownMenuItem>
							<DropdownMenuItem
								on:click={() => {
									commanderState.update((s) => ({
										...s,
										pages: ['search-books'],
										allowPages: false,
										placeholder: 'Search for a book',
										isOpen: true,
									}));
								}}
							>
								<EntryIcon type="book" class="mr-2 h-4 w-4" />
								Book
							</DropdownMenuItem>
							<DropdownMenuItem
								on:click={() => {
									commanderState.update((s) => ({
										...s,
										pages: ['search-podcasts'],
										allowPages: false,
										placeholder: 'Search for a podcast',
										isOpen: true,
									}));
								}}
							>
								<EntryIcon type="podcast" class="mr-2 h-4 w-4" />
								Podcast
							</DropdownMenuItem>
							<DropdownMenuItem
								on:click={() => {
									commanderState.update((s) => ({
										...s,
										pages: ['search-music'],
										allowPages: false,
										placeholder: 'Search for a music album',
										isOpen: true,
									}));
								}}
							>
								<EntryIcon type="album" class="mr-2 h-4 w-4" />
								Album
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
		<!-- TODO: Add Button here -->
		<div class="px-4 py-2">
			<div
				class="space-y-2 transition-opacity lg:space-y-1 {$inArticle
					? 'focus-within:opacity-100 hover:opacity-100 max-2xl:opacity-20'
					: ''}"
			>
				{#each nav as nav_item}
					<Button
						href={nav_item.href}
						class="flex w-full items-center justify-center space-x-2 lg:justify-start"
						variant={nav_item.active($page.url.pathname)
							? 'secondary'
							: 'ghost'}
					>
						<svelte:component
							this={nav_item.icon}
							class="square-6 lg:square-4"
						/>
						<span class="hidden {$inArticle ? '2xl:inline' : 'lg:inline'}"
							>{nav_item.label}</span
						>
					</Button>
				{/each}
				{#if $gardenEnabled}
					<!-- content here -->
					<Button
						href="/external"
						size="sm"
						class="flex hidden w-full items-center justify-center space-x-2 lg:justify-start"
						variant="ghost"
					>
						<FolderSync class="h-5 w-5" />
						<span>External Garden</span>
					</Button>
				{/if}
				<Button
					href="/pins"
					class="flex w-full items-center justify-center lg:hidden lg:justify-start"
					variant="ghost"
				>
					<PinIcon class="h-6 w-6" />
				</Button>
			</div>
		</div>
		{#if user_data}
			<div class="hidden px-4 py-2 {$inArticle ? '2xl:inline' : 'lg:inline'}">
				<div class="group flex items-center">
					<h2 class="mb-2 px-2 text-lg font-semibold tracking-tight">
						<a href="/pins">Pins</a>
					</h2>
					<button
						on:click={pinsComponent.addFolder}
						class="group/icon ml-auto rounded p-2 hover:bg-accent hover:text-accent-foreground"
					>
						<FolderPlus
							class="h-4 w-4 opacity-0 transition-opacity group-hover/icon:opacity-100 group-hover:opacity-70"
						/>
					</button>
				</div>
				<div class="flex flex-col space-y-1">
					{#if $pinsQuery.isPending}
						<Skeleton class="h-10 w-full" />
						<Skeleton class="h-10 w-full" />
					{:else if $pinsQuery.isSuccess}
						{@const pins = $pinsQuery.data}
						<Pins bind:this={pinsComponent} root {pins} />
					{/if}
				</div>
			</div>
		{/if}
		<!-- <Button variant="ghost">Subscriptions</Button> -->
		<ColResizer
			bind:width
			min={220}
			max={330}
			class="absolute inset-y-0 -right-[3px] z-[97] w-2 cursor-col-resize"
		/>
	</nav>
	<button />
{/if}
<!-- we subtract 8 to account for colresizer -->
<!-- {#if $audioPlayer.audio?.src}
	<div
		style:--width="{width}px"
		class="mt-auto flex shrink-0 flex-col pb-2 max-w-[--width] {collapsed
			? ''
			: 'mt-auto border-t'}"
	>
		<AudioPlayer {collapsed} />
	</div>
{/if} -->
<AddUrlModal open={showAddUrlModal} />

<Dialog.Root bind:open={$showAddSubscriptionModal}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Feed</Dialog.Title>
		</Dialog.Header>
		<SubscriptionEntry
			bind:open={$showAddSubscriptionModal}
			form={$page.form}
			searchForm={$page.data.feedSearchForm}
		/>
	</Dialog.Content>
</Dialog.Root>

<Sheet bind:open={mobileNavMenu}>
	<MobileAddMenu bind:open={mobileNavMenu} />
</Sheet>
