<!-- <button on:click={signOutUser}>SIGN OUT</button> -->
<script lang="ts">
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	import CommandPalette from '$lib/components/CommandPalette/CommandPalette.svelte';
	import Notifications from '$lib/components/Notifications.svelte';
	import Modals from '$lib/components/modals/Modals.svelte';
	import DropBox from '$lib/components/DragHelper/DropBox.svelte';
	import KeyboardShortcuts from '$lib/components/KeyboardShortcuts.svelte';
	import Developer from '$lib/components/Developer.svelte';
	import Sidebar from './Sidebar.svelte';
	import GenericCommandPaletteContainer from '$lib/components/CommandPalette/GenericCommandPaletteContainer.svelte';
	import { dev } from '$app/environment';
	import { mainEl } from '$lib/stores/main';
	import { hideSidebar } from '$lib/stores/sidebar';
	import { navigating, page } from '$app/stores';
	import PodcastPlayer from '$lib/components/PodcastPlayer.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import SettingsSidebar from './SettingsSidebar.svelte';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';

	let sidebarWidth: number;
	$: count = $page.data.count;
</script>

<svelte:head />

<!-- helpers -->
<KeyboardShortcuts />

{#if dev}
	<Developer />
{/if}

<div
	class="bg-white text-dark caret-primary-500 dark:bg-gray-900 dark:text-gray-50"
	data-transparency="true"
	on:drag
>
	<Notifications />
	<!-- Grid version -->
	<div
		class="relative flex h-screen min-h-full w-full overflow-hidden {!$hideSidebar &&
			'grid lg:grid-cols-[var(--sidebar-width)_1fr]'} "
		style="--sidebar-width: {sidebarWidth}px;"
	>
		{#if $navigating}
			<!-- TODO: shouldn't show for search -->
			<PreloadingIndicator />
		{/if}
		<!-- sidebar, but should only be for some layouts -->
		<!-- probably better to use layout groups, but this will do for now -->
		{#if $page.route.id?.startsWith('/(app)/u:[username]/settings')}
			<Sidebar bind:width={sidebarWidth}>
				<SettingsSidebar />
			</Sidebar>
		{:else}
			<!-- {:else if !$page.route.id?.startsWith('/(app)/u:[username]/entry')} -->
			<Sidebar bind:width={sidebarWidth} />
		{/if}
		<!-- bind:this={$mainEl} -->
		<main class="relative flex grow flex-col place-items-stretch overflow-auto">
			<!-- Header? -->
			<!-- {$currentList} -->
			<slot />
			<PodcastPlayer />
		</main>
	</div>
	<DropBox />
	<!-- hm: think command palettes should be like their own modals -->
	<!-- TODO: figure out solution here; stacking bugs very possible -->
	<CommandPalette />
	<GenericCommandPaletteContainer />
	<Modals />
</div>
