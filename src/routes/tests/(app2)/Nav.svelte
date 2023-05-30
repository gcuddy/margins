<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
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
		PinIcon
	} from 'lucide-svelte';
	import type { LayoutData } from './$types';
	import { Small } from '$lib/components/ui/typography';
	import AudioPlayer, { audioPlayer } from '$lib/components/AudioPlayer.svelte';
	import mq from '$lib/stores/mq';
	import { useMenuBar } from './MainNav.svelte';
	import ColResizer from '$lib/components/ColResizer.svelte';

	type Nav = {
		label: string;
		icon: import('svelte').ComponentType;
		href: string;
		active: (path: string) => boolean;
	};

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
			label: 'Search',
			href: '/tests/search',
			icon: SearchIcon,
			active: (url) => url.startsWith('/tests/search')
		}
	];

	$: in_article =
		$page.url.pathname.startsWith('/tests/article') || $page.url.pathname.startsWith('/tests/pdf');

	$: collapsed = in_article ? !$mq['2xl'] : !$mq.lg;

	export let user_data: LayoutData['user_data'];

	const menu_bar = useMenuBar();

	export let width = 240;
</script>

<nav
	style:--width='{width}px'
	class="grid items-start gap-2 overflow-y-auto max-w-[--width] {$menu_bar.show
		? 'opacity-100'
		: 'opacity-0'} transition-opacity duration-500 focus-within:opacity-100 hover:opacity-100"
>
	<div class="px-4 py-2">
		<div
			class="space-y-1 transition-opacity {in_article
				? 'focus-within:opacity-100 hover:opacity-100 max-2xl:opacity-20'
				: ''}"
		>
			{#each nav as nav_item}
				<Button
					as="a"
					href={nav_item.href}
					size="sm"
					class="flex w-full items-center justify-start space-x-2"
					variant={nav_item.active($page.url.pathname) ? 'secondary' : 'ghost'}
				>
					<svelte:component
						this={nav_item.icon}
						class="h-6 w-6 {in_article ? '2xl:h-4 2xl:w-4' : 'lg:h-4 lg:w-4'}"
					/>
					<span class="hidden {in_article ? '2xl:inline' : 'lg:inline'}">{nav_item.label}</span>
				</Button>
			{/each}
			<Button
				as="a"
				href="/tests/pins"
				size="sm"
				class="flex w-full items-center justify-start lg:hidden"
				variant="ghost"
			>
				<PinIcon class="h-6 w-6" />
			</Button>
		</div>
	</div>
	{#if user_data}
		<div class="hidden truncate px-4 py-2 {in_article ? '2xl:inline' : 'lg:inline'}">
			<h2 class="mb-2 px-2 text-lg font-semibold tracking-tight">Pins</h2>
			<div class="flex flex-col space-y-1">
				{#await user_data.pins}
					<Skeleton class="h-10 w-full" />
					<Skeleton class="h-10 w-full" />
				{:then pins}
					{#each pins as pin}
						{#if pin.view}
							{@const href = `/tests/views/${pin.view.id}`}
							<Button
								as="a"
								size="sm"
								variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
								class="w-full justify-start font-normal"
								{href}
							>
								<Layers class="mr-2 h-4 w-4 shrink-0" />
								{pin.view.name}</Button
							>
						{:else if pin.collection}
							{@const href = `/tests/collection/${pin.collection.id}`}
							<Button
								as="a"
								size="sm"
								variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
								class="w-full justify-start font-normal"
								{href}
							>
								<Box class="mr-2 h-4 w-4 shrink-0" />
								<span class="truncate"> {pin.collection.name}</span></Button
							>
						{:else if pin.tag}
							{@const href = `/tests/tag/${pin.tag.name}`}
							<Button
								as="a"
								size="sm"
								variant={$page.url.pathname === href ? 'secondary' : 'ghost'}
								class="w-full justify-start font-normal"
								{href}
							>
								<Tag class="mr-2 h-4 w-4 shrink-0" />
								<span class="truncate"> {pin.tag.name}</span></Button
							>
						{/if}
					{/each}
				{/await}
			</div>
		</div>
	{/if}
	<!-- <Button variant="ghost">Subscriptions</Button> -->
</nav>
{#if $audioPlayer.audio?.src}
	<div style:--width='{width}px' class="mt-auto flex shrink-0 flex-col max-w-[--width] pb-2 {collapsed ? '' : 'mt-auto border-t'}">
		<AudioPlayer {collapsed} />
	</div>
{/if}

<ColResizer bind:width max={500} class="absolute px-2 w-0 h-full after:bg-border after:w-px after:block after:h-full cursor-col-resize right-0 top-0 bottom-0" />
