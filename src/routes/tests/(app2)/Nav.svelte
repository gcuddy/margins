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
		PinIcon,
		BrainCircuit,
		FlowerIcon
	} from 'lucide-svelte';
	import type { LayoutData } from './$types';
	import { Small } from '$lib/components/ui/typography';
	import AudioPlayer, { audioPlayer } from '$lib/components/AudioPlayer.svelte';
	import mq from '$lib/stores/mq';
	import { useMenuBar } from './MainNav.svelte';
	import ColResizer from '$lib/components/ColResizer.svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { createAvatar, melt } from '@melt-ui/svelte';

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
</script>

{#if !$inArticle}
	<div style:width="{width}px" />
	<nav
		style:--width="{width}px"
		class="flex flex-col gap-2 overflow-y-auto fixed top-0 left-0 bottom-0 grow h-full border-r w-[--width] {$menu_bar.show
			? 'opacity-100'
			: 'opacity-0'} transition-opacity duration-500 focus-within:opacity-100 hover:opacity-100"
	>
		<div class="px-4 py-2 h-[--nav-height] flex items-center">
			<!-- <span class="flex text-muted-foreground items-center"><FlowerIcon class="h-6 w-6 mr-1" /> <span class="text-sm font-medium">Margins</span> </span> -->
			{#if $page.data.user_data?.username}
				<a href="/tests/settings" class="flex items-center gap-x-2 w-full">
					<span class="relative flex h-5 w-5 shrink-0 overflow-hidden rounded-full">
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
							{$page.data.user_data.username[0].toUpperCase()}
						</span>
					</span>
					<span class="text-sm font-medium">{$page.data.user_data.username}</span>
					<!-- <Skeleton class="h-8 w-8 rounded-full border border-gray-200" /> -->
				</a>
			{/if}
		</div>
		<div class="px-4 py-2">
			<div
				class="space-y-1 transition-opacity {$inArticle
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
							class="h-6 w-6 {$inArticle ? '2xl:h-4 2xl:w-4' : 'lg:h-4 lg:w-4'}"
						/>
						<span class="hidden {$inArticle ? '2xl:inline' : 'lg:inline'}">{nav_item.label}</span>
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
			<div class="hidden truncate px-4 py-2 {$inArticle ? '2xl:inline' : 'lg:inline'}">
				<h2 class="mb-2 px-2 text-lg font-semibold tracking-tight">Pins</h2>
				<div class="flex flex-col space-y-1">
					<!-- {#await user_data.pins}
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
				{/await} -->
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
