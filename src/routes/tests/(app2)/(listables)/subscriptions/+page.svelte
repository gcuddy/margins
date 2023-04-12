<script>
	import { page } from "$app/stores";
	import Intersector from "$lib/components/Intersector.svelte";
	import { getCurrentListContext } from "$lib/stores/currentList";
	import { fetchMore } from "./utils";

	export let data;

	let fetching_more = false;
	$: cache = data.cache;
	$: $cache.set(["rss", "all"], {
		fn: fetchMore,
		// time in seconds
		staleTime: 60,
	});

	const currentList = getCurrentListContext();
	$: currentList.set({
		entries: data.feeds.entries,
		slug: $page.url.pathname,
		context: "rss",
		cursor: data.feeds.nextCursor,
		fetcher: (cursor) =>
			fetchMore({
				cursor,
				take: 25,
			}),
	});

	// preferred api: cache.createquery or cache.query
	// returns a query store that can be used to get data and cache data
	// optionally can also use idb
</script>

{#each data.feeds.entries as entry}
	<div class="flex flex-col">
		<a href="/tests/entry/{entry.id}">{entry.title}</a>
		<span> {entry.feed_title}</span>
	</div>
{/each}

<!-- progressively enhance by adding a form/url param to paginate by going to next page with ?timestamp=-->
<Intersector
	cb={() => {
		// alert("intersector");
		if (!fetching_more && data.feeds.nextCursor) {
			fetchMore({
				cursor: data.feeds.nextCursor,
				take: 25,
			}).then((newData) => {
				data.feeds.entries = [...data.feeds.entries, ...newData.entries];
				data.feeds.nextCursor = newData.nextCursor;
			});
		}
	}}
>
	{#if fetching_more}
		loading...
	{/if}
</Intersector>

<!-- <form action="?/fetchMore" method="post">
	<input type="hidden" name="cursor" value={data.feeds.nextCursor} />
	<Button type="submit">Load more</Button>
</form> -->

<!-- {#await data.lazy.feeds}
	loading...
{:then { entries, nextCursor }}
	{#each entries as entry}
		<div>
			<h2>{entry.title}</h2>
		</div>
	{/each}

{/await} -->
