<!-- <button on:click={signOutUser}>SIGN OUT</button> -->
<script lang="ts">
	import { signOut, getSession } from 'lucia-sveltekit/client';

	const signOutUser = async () => {
		await signOut();
		window.location.href = '/';
	};
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	$: ({ user } = data);
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
	import { page } from '$app/stores';
	import { Lucia } from 'lucia-sveltekit/client';
	import PodcastPlayer from '$lib/components/PodcastPlayer.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	let sidebarWidth: number;
	// if ($lucia) {
	// 	console.log({ $lucia });
	// 	// authenticated
	// } else {
	// 	console.log('not authenticated');
	// }
</script>

<svelte:head />

<!-- helpers -->
<KeyboardShortcuts />

{#if dev}
	<Developer />
{/if}

<ProgressBar />

<div class="bg-white text-dark caret-primary-500 dark:bg-gray-900 dark:text-gray-50" on:drag>
	<Notifications />
	<!-- Grid version -->
	<div
		class="relative flex h-screen min-h-full w-full overflow-hidden {!$hideSidebar &&
			'lg:grid-cols-[var(--sidebar-width)_1fr] grid'} "
		style="--sidebar-width: {sidebarWidth}px;"
	>
		<!-- sidebar, but should only be for some layouts -->
		<Sidebar {user} bind:width={sidebarWidth} />

		<main bind:this={$mainEl} class="relative flex grow flex-col place-items-stretch overflow-auto">
			<!-- Header? -->
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
