<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/favorites.json', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (!res.ok) {
			return {
				status: res.status
			};
		}
		const { favorites } = await res.json();
		return {
			status: 200,
			props: {
				favorites
			}
		};
	};
</script>

<script lang="ts">
	import '../app.css';
	import CommandPalette from '$lib/components/CommandPalette/CommandPalette.svelte';
	import Notifications from '$lib/components/Notifications.svelte';
	import Modals from '$lib/components/modals/Modals.svelte';
	import DropBox from '$lib/components/DragHelper/DropBox.svelte';
	import KeyboardShortcuts from '$lib/components/KeyboardShortcuts.svelte';
	import Developer from '$lib/components/Developer.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import GenericCommandPaletteContainer from '$lib/components/CommandPalette/GenericCommandPaletteContainer.svelte';
	import { dev } from '$app/env';
	import { mainEl } from '$lib/stores/main';
	import type { FavoriteWithPayload } from '$lib/types/schemas/Favorite';
	import { hideSidebar } from '$lib/stores/sidebar';

	export let favorites: FavoriteWithPayload[] = [];
	$: console.log({ favorites });

	let sidebarWidth: number;
</script>

<svelte:head />

<!-- helpers -->
<KeyboardShortcuts />

{#if dev}
	<Developer />
{/if}

<!-- Todo: josh comeau reset that makes this 100vh/% so we don't screw thigns up -->

<div class="min-h-screen">
	<div
		class="min-h-screen bg-white text-dark caret-primary-500 dark:bg-gray-900 dark:text-gray-50"
		on:drag
	>
		<!-- <nav>
			<a sveltekit:prefetch href="/">Home</a>
			<a sveltekit:prefetch href="/notebook">Notebook</a>
			<a sveltekit:prefetch href="/rss">RSS</a>
		</nav> -->
		<Notifications />
		<!-- Grid version -->
		<div
			class="relative flex h-screen min-h-full w-full overflow-hidden {!$hideSidebar &&
				'lg:grid-cols-[var(--sidebar-width)_1fr] grid'} "
			style="--sidebar-width: {sidebarWidth}px;"
		>
			<!-- sidebar, but should only be for some layouts -->
			<Sidebar {favorites} bind:width={sidebarWidth} />

			<main
				bind:this={$mainEl}
				class="relative flex grow flex-col place-items-stretch overflow-auto"
			>
				<!-- Header? -->
				<slot />
			</main>
		</div>
		<DropBox />
		<!-- hm: think command palettes should be like their own modals -->
		<!-- TODO: figure out solution here; stacking bugs very possible -->
		<CommandPalette />
		<GenericCommandPaletteContainer />
		<Modals />
	</div>
</div>

<style lang="postcss">
	:global(body > div) {
		height: 100%;
	}
	/* nav {
		position: sticky;
		top: 0;
	} */
	:global(::selection) {
		@apply bg-primary-600/50 dark:bg-primary-800;
	}
	:global(html) {
		@apply dark:bg-gray-800;
	}
	:global(:root) {
		color-scheme: light dark;
	}
</style>
