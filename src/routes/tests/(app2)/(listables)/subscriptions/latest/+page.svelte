<script lang="ts">
	import { enhance } from '$app/forms';
	import Intersector from '$lib/components/Intersector.svelte';
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import EntryList from '$lib/components/entries/EntryList.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { Snapshot } from './$types.js';

	export let data;

	$: query = data.query();

	let active_id: number | undefined = undefined;

	export const snapshot: Snapshot = {
		capture: () => active_id,
		restore: (id) => (active_id = id)
	};
</script>

<form class='m-4' data-sveltekit-keepfocus data-sveltekit-replacestate>
	<Input type="text" name="search" placeholder="Search..." value={data.search} />
</form>

{#if $query.isLoading}
	<EntryItemSkeleton />
	<EntryItemSkeleton />
	<EntryItemSkeleton />
	<EntryItemSkeleton />
	<EntryItemSkeleton />
{:else if $query.isSuccess}
	<EntryList
		bind:active_id
		bulkForm={data.bulkForm}
		entries={$query.data.pages.flatMap((page) => page.entries) ?? []}
	/>
{/if}

<!-- progressively enhance by adding a form/url param to paginate by going to next page with ?timestamp=-->
<Intersector
	cb={() => {
		if ($query.hasNextPage && !$query.isFetchingNextPage) {
			$query.fetchNextPage();
		}
	}}
>
	{#if $query.isFetchingNextPage}
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		loading...
	{/if}
</Intersector>
