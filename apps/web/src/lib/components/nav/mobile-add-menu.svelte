<script>
    	import {
    		Link2,
    		Rss
    	} from 'lucide-svelte';

	
	
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import Separator from '$components/ui/Separator.svelte';
	import { showAddSubscriptionModal } from '$lib/stores/subscriptions';
	import { commanderState } from '../../../routes/(app2)/Commander.svelte';
	import { showAddUrlModalStore } from '../../../routes/(app2)/Nav.svelte';

	import BottomSheet from "$components/ui/sheet/bottom-sheet.svelte";
	import MobileLink from "./mobile-link.svelte";
    export let open = false;
</script>
<BottomSheet
>
	<div class="space-y-4">
		<span
			class="font-semibold leading-none tracking-tight text-muted-foreground"
			>Add New Item…</span
		>
		<div class="flex flex-col">
			<MobileLink
				bind:open
				on:click={() => {
					showAddUrlModalStore.set(true);
				}}
			>
				<Link2 class="w-5 h-5 mr-2" />
				URL
			</MobileLink>
			<MobileLink
				bind:open
				on:click={() => {
					showAddSubscriptionModal.set(true);
				}}
			>
				<Rss class="w-5 h-5 mr-2" />
				Subscription
			</MobileLink>
			<div class="py-5">
				<Separator />
			</div>
			<!-- href="/search?type=movie" -->
			<MobileLink
				bind:open
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
				<EntryIcon type="movie" class="w-5 h-5 mr-2" />
				Movie or TV Show
			</MobileLink>
			<MobileLink
				bind:open
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
				<EntryIcon type="book" class="w-5 h-5 mr-2" />
				Book
			</MobileLink>
			<MobileLink
				bind:open
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
				<EntryIcon type="podcast" class="w-5 h-5 mr-2" />
				Podcast
			</MobileLink>
			<MobileLink
				bind:open
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
				<EntryIcon type="album" class="w-5 h-5 mr-2" />
				Album
			</MobileLink>
		</div>
	</div>
</BottomSheet>
