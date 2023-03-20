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
	import { browser, dev } from "$app/environment";
	import { mainEl } from "$lib/stores/main";
	import { hideSidebar } from "$lib/stores/sidebar";
	import { navigating, page } from "$app/stores";
	import PodcastPlayer from "$lib/components/PodcastPlayer.svelte";
	import ProgressBar from "$lib/components/ProgressBar.svelte";
	import SettingsSidebar from "./SettingsSidebar.svelte";
	import PreloadingIndicator from "$lib/components/PreloadingIndicator.svelte";
	import mq from "$lib/stores/mq";
	import { trpcWithQuery } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { notifications } from "$lib/stores/notifications";
	import { selectedItems } from "$lib/stores/selectedItems";
	import { onDestroy, onMount, setContext } from "svelte";
	import { UpdateBookmarkMutationKey } from "$lib/features/entries/mutations";
	import MutationProvider from "./MutationProvider.svelte";
	import { createCurrentListStore, setCurrentListContext } from "$lib/stores/currentList";
	import { createUserDataStore, setUserDataContext } from "$lib/stores/userdata";

	let sidebarWidth: number;
	$: count = $page.data.count;

    const current_list = createCurrentListStore();
    setCurrentListContext(current_list);


    const user_data = createUserDataStore();
    setUserDataContext(user_data);

	// const queryClient = new QueryClient({
	// 	defaultOptions: {
	// 		queries: {
	// 			enabled: browser,
	// 		},
	// 	},
	// });
	// REVIEW: also can do data.queryclient passed by layout.ts

	// $: console.log({ queryClient: data.queryClient });
	// import { persistQueryClient } from "@tanstack/query-persist-client-core";
	// import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
	// import * as devalue from "devalue";
	// import { get as getItem, set as setItem, del as removeItem } from "idb-keyval";

	// let unsubscribePersister: () => void;

	// onMount(() => {
	// 	const idbPersister = createAsyncStoragePersister({
	// 		storage: {
	// 			getItem: async (key) => getItem(key) as Promise<string | null>,
	// 			setItem,
	// 			removeItem,
	// 		},
	// 		key: "margins.cache",
	// 		throttleTime: 2000,
	// 		serialize: (data) => devalue.stringify(data),
	// 		deserialize: (data) => devalue.parse(data),
	// 	});

	// 	const [unsubscribe, promise] = persistQueryClient({
	// 		queryClient: data.queryClient,
	// 		persister: idbPersister,
	// 	});
	// 	unsubscribePersister = unsubscribe;
	// });

	// onDestroy(() => {
	// 	unsubscribePersister?.();
	// });
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
			class="simple-scrollbars bg-base text-content caret-primary-500 dark:text-gray-50 {!$mq.desktop
				? 'mobile'
				: ''}"
			data-transparency="true"
			on:drag
		>
			<Notifications />
			<!-- Grid version -->
			<div
				class="relative flex h-screen min-h-full w-full overflow-hidden "
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
				<main class="relative flex grow flex-col place-items-stretch overflow-auto">
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
