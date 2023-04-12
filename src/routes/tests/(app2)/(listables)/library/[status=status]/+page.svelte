<script>
	import { page } from "$app/stores";
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
	{#each $currentList.entries as entry}
		<li>
			<a href="/tests/entry/{entry.id}">{entry.title}</a>
		</li>
	{/each}
	{#if $hasMore}
		<li>
			<a href="/tests/library/{data.status}/?cursor={$currentList.cursor}">
				Load more
			</a>
		</li>
	{/if}
</ul>
