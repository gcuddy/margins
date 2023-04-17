<script lang="ts">
	import { page } from "$app/stores";
	import EntryList from "$lib/components/entries/EntryList.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { H1 } from "$lib/components/ui/typography";
	import { getCurrentListContext } from "$lib/stores/currentList";
	import LibraryTabs from "./LibraryTabs.svelte";

	export let data;

	const currentList = getCurrentListContext();

	const { hasMore } = currentList;

	$: currentList.set({
		entries: data.entries.entries,
		slug: $page.url.pathname,
		cursor: data.entries.nextCursor,
		context: "bookmarks",
	});
</script>

<H1>Library</H1>

<!-- tabs -->
<div>
	<LibraryTabs />
</div>

<ul>
	<EntryList entries={data.entries.entries} />
	<!-- {#each data.entries.entries as entry}
		<li>
			<Button variant="link" as="a" href="/tests/{entry.type}/{getId(entry)}">
				{entry.title}
			</Button>
		</li>
	{/each} -->
	{#if $hasMore}
		<li>
			<a href="/tests/library/{data.status}/?cursor={$currentList.cursor}">
				Load more
			</a>
		</li>
	{/if}
</ul>
