<!-- <button on:click={signOutUser}>SIGN OUT</button> -->
<script lang="ts">
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

	import type { LayoutData } from "./$types";
	export let data: LayoutData;
	import CommandPalette from "$lib/components/CommandPalette/CommandPalette.svelte";
	import Notifications from "$lib/components/Notifications.svelte";
	import Modals from "$lib/components/modals/Modals.svelte";
	import DropBox from "$lib/components/DragHelper/DropBox.svelte";
	import KeyboardShortcuts from "$lib/components/KeyboardShortcuts.svelte";
	import Developer from "$lib/components/Developer.svelte";
	import Sidebar from "./Sidebar.svelte";
	import GenericCommandPaletteContainer from "$lib/components/CommandPalette/GenericCommandPaletteContainer.svelte";
	import { dev } from "$app/environment";
	import { navigating, page } from "$app/stores";
	import PodcastPlayer from "$lib/components/PodcastPlayer.svelte";
	import SettingsSidebar from "./SettingsSidebar.svelte";
	import PreloadingIndicator from "$lib/components/PreloadingIndicator.svelte";
	import mq from "$lib/stores/mq";
	import MutationProvider from "./MutationProvider.svelte";
	import {
		createCurrentListStore,
		setCurrentListContext,
	} from "$lib/stores/currentList";
	import {
		createUserDataStore,
		setUserDataContext,
	} from "$lib/stores/userdata";
	import { writable } from "svelte/store";
	import { setContext } from "svelte";
	import { beforeNavigate } from "$app/navigation";
	import Commander from "../tests/(app2)/Commander.svelte";

	let sidebarWidth: number;
	$: count = $page.data.count;

	const last_urls = writable<string[]>([]);
	setContext("last_urls", last_urls);

	beforeNavigate(() => {
		last_urls.update((urls) => {
			if (urls.length > 10) {
				urls.pop();
			}
			urls.unshift($page.url.pathname);
			return urls;
		});
	});

	const current_list = createCurrentListStore();
	setCurrentListContext(current_list);

	const user_data = createUserDataStore();
	setUserDataContext(user_data);
</script>

<svelte:head />

<!-- helpers -->
<KeyboardShortcuts />

{#if dev}
	<Developer />
{/if}
<QueryClientProvider client={data.queryClient}>
	<MutationProvider>
			<div
				class="simple-scrollbars app container bg-base text-content caret-primary-500 dark:text-gray-50 {!$mq.desktop
					? 'mobile'
					: ''}"
				data-transparency="true"
				on:drag
			>
				<Notifications />
				<!-- Grid version -->
				<div
					class="relative flex h-screen min-h-full w-full overflow-hidden"
					style="--sidebar-width: {sidebarWidth}px;"
				>
					{#if $navigating}
						<!-- TODO: shouldn't show for search -->
						<PreloadingIndicator />
					{/if}
					<!-- sidebar, but should only be for some layouts -->
					<!-- probably better to use layout groups, but this will do for now -->
					{#if $page.route.id?.startsWith("/(app)/settings")}
						<Sidebar bind:sidebarWidth>
							<SettingsSidebar />
						</Sidebar>
					{:else}
						<!-- {:else if !$page.route.id?.startsWith('/(app)/u:[username]/entry')} -->
						<Sidebar bind:sidebarWidth />
					{/if}
					<!-- bind:this={$mainEl} -->
					<main
						class="relative flex h-full grow flex-col place-items-stretch overflow-auto"
					>
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
	</MutationProvider>
</QueryClientProvider>

<style lang="postcss">
	/* .simple-scrollbars :global(*) {
		@apply scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-border scrollbar-thumb-rounded-lg scrollbar-track-transparent;
	} */
</style>
