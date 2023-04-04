<script lang="ts">
	import { page } from "$app/stores";
	import Intersector from "$lib/components/Intersector.svelte";
	import ItemList from "$lib/components/ItemList.svelte";
	import { getCurrentListContext } from "$lib/stores/currentList";

	import type { ViewOptions } from "$lib/types/schemas/View";
	import type { PageData } from "./$types";
	export let data: PageData;

	$: console.log({ data });

	$: query = data.query();
	$: entries = $query.data?.pages.flatMap((page) => page.entries) ?? [];

	let peek = false;

	const DEFAULT_RSS_VIEW_OPTIONS: ViewOptions = {
		view: "list",
		sort: "published",
		properties: {
			author: false,
			site: false,
			description: true,
			tags: true,
			wordCount: false,
			date: true,
			image: false,
			readProgress: true,
			location: false,
			pageNote: false,
			url: false,
			annotationCount: true,
		},
	};

	$: only_unread = Boolean($page.url.searchParams.get("unread"));

	const current_list = getCurrentListContext();
	$: current_list.set({
		entries,
		slug: $page.url.pathname,
	});
</script>

<!-- <svelte:window
	on:keydown={(e) => {
		if (e.key === ' ') {
			peek = !peek;
		} else {
			peek = false;
		}
	}}
/> -->

<ItemList {entries} loading={$query.isLoading} />
<Intersector
	cb={() => {
		// alert("intersector");
		if ($query.hasNextPage && !$query.isFetchingNextPage) {
			$query.fetchNextPage();
		}
	}}>Loading...</Intersector
>
