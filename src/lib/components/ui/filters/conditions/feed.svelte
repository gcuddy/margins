<script lang='ts'>
	import { queryFactory } from "$lib/queries/querykeys";
	import { createQuery } from "@tanstack/svelte-query";
	import { derived } from "svelte/store";


    const feedQuery = createQuery(queryFactory.subscriptions.all());

    export let id: number[] = [];

    const selectedFeeds = derived(feedQuery, ($feedQuery) => {
        return $feedQuery.data?.filter((f) => id.includes(f.feedId)) ?? [];
    });
</script>
<!-- TODO... -->
