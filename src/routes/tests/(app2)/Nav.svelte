<script lang="ts">
	import { navigating, page } from '$app/stores';
	import { buttonVariants, Button } from '$lib/components/ui/button';
	import Skeleton from '$lib/components/ui/skeleton/Skeleton.svelte';
	import {
		BookMarked,
		Layers,
		Box,
		Library,
		Rss,
		SearchIcon,
		TreePine,
		Home,
		Tag,
		PinIcon,
		BrainCircuit,
		FlowerIcon,
		PlusCircle,
		Loader,
		ChevronDownIcon,
		RssIcon,
		FolderMinus,
		FolderPlus
	} from 'lucide-svelte';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator
	} from '$components/ui/dropdown-menu2';
	import type { LayoutData } from './$types';
	import { Small } from '$lib/components/ui/typography';
	import AudioPlayer, { audioPlayer } from '$lib/components/AudioPlayer.svelte';
	import mq from '$lib/stores/mq';
	import { useMenuBar } from './MainNav.svelte';
	import ColResizer from '$lib/components/ColResizer.svelte';
	import { getContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { createAvatar, createDropdownMenu, melt } from '@melt-ui/svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { createQuery, useIsMutating } from '@tanstack/svelte-query';
	import Separator from '$components/ui/Separator.svelte';
	import { cn } from '$lib';
	import AddUrlModal from '$components/modals/add-url-modal.svelte';
	import { queryFactory } from '$lib/queries/querykeys';
	import { TagColorPill } from '$components/tags/tag-color';
	import { Icon } from '$components/icon-picker';
	import { flip } from 'svelte/animate';
	import Pins from '$components/pins/pins.svelte';

	let pinsComponent: Pins;

	type Nav = {
		label: string;
		icon: import('svelte').ComponentType;
		href: string;
		active: (path: string) => boolean;
	};

	const isRestoring = getContext('isRestoring') as Writable<boolean>;
	const isMutating = useIsMutating();

	const nav: Nav[] = [
		{
			label: 'Home',
			href: '/tests/home',
			icon: Home,
			active: (url) => url.startsWith('/tests/home')
		},
		{
			label: 'Library',
			href: '/tests/library/backlog',
			icon: Library,
			active: (url) => url.startsWith('/tests/library')
		},
		{
			label: 'Subscriptions',
			href: '/tests/subscriptions',
			icon: Rss,
			active: (url) => url.startsWith('/tests/subscriptions')
		},
		{
			label: 'Collections',
			href: '/tests/collections',
			icon: Box,
			active: (path) => path === '/tests/collections'
		},
		{
			label: 'Evergreens',
			href: '/tests/notes',
			icon: TreePine,
			active: (url) => url.startsWith('/tests/notes')
		},
		{
			label: 'Notebook',
			href: '/tests/notebook',
			icon: BookMarked,
			active: (url) => url.startsWith('/tests/notebook')
		},
		{
			label: 'Views',
			href: '/tests/views',
			icon: Layers,
			active: (url) => url === '/tests/views'
		},
		{
			label: 'Memory Palace',
			href: '/tests/srs',
			icon: BrainCircuit,
			active: (url) => url === '/tests/views'
		},
		{
			label: 'Search',
			href: '/tests/search',
			icon: SearchIcon,
			active: (url) => url.startsWith('/tests/search')
		}
	];

	const pinsQuery = createQuery(queryFactory.pins.list());

	const inArticle = getContext('inArticle') as Writable<boolean>;

	$: collapsed = $inArticle ? !$mq['2xl'] : !$mq.lg;

	export let user_data: LayoutData['user_data'];

	const menu_bar = useMenuBar();

	export let width = 240;

	const {
		elements: { fallback, image }
	} = createAvatar({
		src: $page.data.user_data?.avatar ?? ''
	});

	let borderBoxSize: Array<{ blockSize: number; inlineSize: number }> | undefined | null;
	const mobileNavWidth = getContext('mobileNavWidth') as Writable<number>;
	$: mobileNavWidth.set(borderBoxSize?.[0]?.inlineSize ?? 81);

	export let showAddUrlModal = writable(false);
</script>

{#if !$inArticle}
	<div
		style:--mobile-nav-width="{$mobileNavWidth}px"
		style:--width="{width}px"
		class="w-[--mobile-nav-width] lg:w-[--width]"
	/>
	<nav
		bind:borderBoxSize
		style:--width="{width}px"
		class="flex flex-col gap-2 overflow-y-auto overscroll-contain fixed top-0 left-0 bottom-0 grow h-full border-r lg:w-[--width] {$menu_bar.show
			? 'opacity-100'
			: 'opacity-0'} transition-opacity duration-500 focus-within:opacity-100 hover:opacity-100"
	>
		<div class="px-4 py-2 h-[--nav-height] flex items-center shrink-0 relative">
			<!-- <span class="flex text-muted-foreground items-center"><FlowerIcon class="h-6 w-6 mr-1" /> <span class="text-sm font-medium">Margins</span> </span> -->
			{#if $page.data.user_data?.username}
				<DropdownMenu>
					<DropdownMenuTrigger asChild let:builder>
						<a
							use:melt={builder}
							href="/tests/settings"
							on:click|preventDefault
							class="flex items-center gap-x-2 w-fit data-[state=open]:bg-accent p-2 rounded"
						>
							<span
								class="relative flex lg:square-5 square-8 shrink-0 overflow-hidden rounded-full"
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
							<span class="text-sm font-medium hidden lg:inline"
								>{$page.data.user_data.username}</span
							>
						</a>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="w-[250px] focus-visible:outline-none">
						<DropdownMenuItem on:m-click={() => goto('/tests/settings')}>
							<a class={'contents'} href="/tests/settings">Settings</a>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem on:m-click={() => goto('/tests/logout')}>
							<a class={'contents'} href="/tests/logout">Logout</a>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			{/if}
			{#if $isRestoring || $isMutating}
				<span transition:fade={{ duration: 75 }} class="absolute my-auto right-4 hidden lg:flex">
					<Loader class="h-4 w-4 animate-spin text-muted-foreground" />
				</span>
			{/if}
		</div>
		<div class="px-4">
			<div class="flex items-center">
				<!-- TODO: on small sizes, these should switch — the button should trigger the dropdown -->
				<Button
					on:click={() => {
						// open modal
						showAddUrlModal.set(true);
					}}
					size="sm"
					variant="outline"
					class="w-full justify-center lg:justify-start gap-x-2 lg:rounded-r-none lg:border-r-0"
				>
					<PlusCircle class="square-5 lg:square-4 shrink-0" />
					<span class="hidden lg:inline">Add</span>
					<!-- TODO: create dropdown menu for type, and add Modal -->
				</Button>
				<Separator class="h-9 hidden lg:flex" orientation="vertical" />
				<DropdownMenu
					positioning={{
						placement: 'bottom-end'
					}}
				>
					<DropdownMenuTrigger let:builder asChild>
						<button
							class={cn(
								buttonVariants({ variant: 'outline', size: 'sm' }),
								'px-2 shadow-none rounded-l-none border-l-0 hidden lg:flex'
							)}
							use:melt={builder}
						>
							<!--  -->
							<ChevronDownIcon class="h-4 w-4 text-secondary-foreground" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="w-56">
						<DropdownMenuItem>
							<RssIcon class="h-4 w-4 mr-2" />
							<span>Add Subscription</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
		<!-- TODO: Add Button here -->
		<div class="px-4 py-2">
			<div
				class="space-y-1 transition-opacity {$inArticle
					? 'focus-within:opacity-100 hover:opacity-100 max-2xl:opacity-20'
					: ''}"
			>
				{#each nav as nav_item}
					<Button
						href={nav_item.href}
						size="sm"
						class="flex w-full items-center justify-center lg:justify-start space-x-2"
						variant={nav_item.active($page.url.pathname) ? 'secondary' : 'ghost'}
					>
						<svelte:component this={nav_item.icon} class="square-5 lg:square-4" />
						<span class="hidden {$inArticle ? '2xl:inline' : 'lg:inline'}">{nav_item.label}</span>
					</Button>
				{/each}
				<Button
					href="/tests/pins"
					size="sm"
					class="flex w-full items-center justify-center lg:justify-start lg:hidden"
					variant="ghost"
				>
					<PinIcon class="h-6 w-6" />
				</Button>
			</div>
		</div>
		{#if user_data}
			<div class="hidden px-4 py-2 {$inArticle ? '2xl:inline' : 'lg:inline'}">
				<div class="flex group items-center">
					<h2 class="mb-2 px-2 text-lg font-semibold tracking-tight"><a href="/tests/pins">Pins</a></h2>
					<button on:click={pinsComponent.addFolder} class="ml-auto rounded p-2 group/icon hover:bg-accent hover:text-accent-foreground">
						<FolderPlus
							class="h-4 w-4 opacity-0 group-hover:opacity-70 group-hover/icon:opacity-100 transition-opacity"
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
			class="absolute inset-y-0 w-2 cursor-col-resize z-[97] -right-[3px]"
		/>
	</nav>
	<button />
{/if}
{#if $audioPlayer.audio?.src}
	<!-- we subtract 8 to account for colresizer -->
	<div
		style:--width="{width}px"
		class="mt-auto flex shrink-0 flex-col pb-2 max-w-[--width] {collapsed
			? ''
			: 'mt-auto border-t'}"
	>
		<AudioPlayer {collapsed} />
	</div>
{/if}
<AddUrlModal open={showAddUrlModal} />
