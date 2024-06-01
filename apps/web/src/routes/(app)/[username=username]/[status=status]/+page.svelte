<script lang="ts">
	import {
		ShellHeader,
		ShellContent,
		getShellCtx,
	} from '@margins/features/shell';
	import { LibraryStore } from '@margins/features/data';
	import { getReplicache } from '$lib/client/replicache';
	import { createId } from '@margins/lib';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { EntryItem, LocationsDropdown } from '@margins/features/entries';
	export let data;

	const rep = getReplicache();
	const allBookmarks = LibraryStore.all.watch(
		() => rep,
		() => [],
	)();

	$: bookmarks = derived(allBookmarks, ($allBookmarks) => {
		return $allBookmarks.filter((b) => {
			return b.status === data.statusType && b.entry && b.entry.title;
		});
	});

	const { entryContext } = getShellCtx();

	$: {
		$entryContext.breadcrumbs = [
			{
				href: $page.url.pathname,
				text: data.status,
			},
		];
		$entryContext.currentList = $bookmarks;
	}
</script>

<ShellHeader>
	<LocationsDropdown status={data.statusType} variant="ghost" color="gray" />
</ShellHeader>

<svelte:window
	on:paste={() => {
		navigator.clipboard.readText().then((text) => {
			rep.mutate.bookmark_create({
				id: createId(),
				status: 'Backlog',
				uri: text,
			});
		});
	}}
/>
<ShellContent>
	<ul class="overflow-y-auto py-1">
		{#each $bookmarks as bookmark}
			<li>
				<!-- TODO: figure out if we should link to bookmark id or entry id...
                    bookmark id makes sense her ebut then entry id more generic so makes sense also
                -->
				<EntryItem user={$page.data.user} {bookmark} />
			</li>
		{/each}
	</ul>
</ShellContent>
