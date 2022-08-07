<script lang="ts">
	import { goto } from '$app/navigation';
	import type { IconName } from '$lib/icons';
	import { modals } from '$lib/stores/modals';
	import Button from '../Button.svelte';
	import { tweened, spring } from 'svelte/motion';

	import Icon from '../helpers/Icon.svelte';
	import UrlModal from '../modals/URLModal.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import mq from '$lib/stores/mq';
	import { page } from '$app/stores';
	import { commandPaletteStore } from '../CommandPalette/store';
	import { showCommandPalette } from '$lib/stores/commands';
	import Sync from '../Sync.svelte';

	interface NavItem {
		display: string;
		href: string;
		icon: IconName;
		// defaults to active if path = href
		active?: (path: string) => boolean;
	}

	const hardcodedNav: NavItem[] = [
		{
			display: 'Home',
			href: '/',
			icon: 'home'
		},
		{
			display: 'Lists',
			href: '/lists',
			icon: 'collection'
		},
		{
			display: 'RSS',
			href: '/rss',
			icon: 'rss'
		},
		{
			display: 'Notebook',
			href: '/notebook',
			icon: 'bookmarkAlt'
		}
	];

	// TODO: un hard code this
	// sidebar-offset -> hard coding this for now because i can't think of another way
	const left = tweened(-300, {
		duration: 150
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
<nav
	on:click={handleClick}
	style="left: {$left}px;"
	class="absolute z-10 flex h-full w-60 select-none flex-col space-y-3 border-r bg-gray-50 pt-10 shadow-xl transition-opacity dark:border-gray-700 dark:bg-gray-900 dark:shadow-2xl lg:static lg:z-auto lg:pt-0 lg:shadow-none"
>
	<!-- Flexbox: set width -->
	<!-- <nav
				class="user-select-none relative flex min-w-max max-w-xs flex-col border-r bg-gray-400 transition-opacity lg:w-56  lg:shrink-0 "
			> -->
	<div class="flex shrink-0 flex-col items-stretch justify-between space-y-3 px-5 py-2">
		<div class="flex justify-between">
			<span>User profile</span>
			<div class="flex space-x-2">
				<Sync />
				<Icon name="cogSolid" className="h-4 w-4 fill-current" />
			</div>
		</div>
		<div class="flex space-x-2">
			<!-- todo: make this work without js? -->
			<Button
				on:click={() => {
					console.log('clicked');
					modals.open(UrlModal);
				}}
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
	<div class="flex grow flex-col items-stretch space-y-1 overflow-y-auto px-5 text-sm">
		{#each hardcodedNav as nav}
			<SidebarItem {...nav} />
		{/each}
	</div>

	<!-- toggle button -->
	<button
		class="fixed top-0 left-0 z-20 !mt-0 flex h-14 w-12 cursor-default flex-col items-center justify-center p-0.5 pl-2 lg:hidden"
		on:click={toggleSidebar}
	>
		<Icon name="menu" className="h-5 w-5 stroke-2 stroke-current" />
		<span class="sr-only">Toggle menu</span>
	</button>
</nav>

<style lang="postcss">
	nav {
		left: var(--sidebar-offset);
		@apply lg:left-0;
	}
</style>
