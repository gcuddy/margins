<script lang="ts">
	import EntryItemSkeleton from '$lib/components/entries/EntryItemSkeleton.svelte';
	import EntryList from '$lib/components/entries/EntryList.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Snapshot } from './$types';
	import Skeleton from '$lib/components/ui/skeleton/Skeleton.svelte';
	import { H1 } from '$lib/components/ui/typography';

	export let data;

	$: query = data.query();

	let active_id: number | undefined = undefined;

	export const snapshot: Snapshot = {
		capture: () => active_id,
		restore: (id: number) => (active_id = id)
	};
</script>

{#if $query.isLoading}
	<Skeleton class="h-10 w-1/2" />
	<div class="flex flex-col">
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
		<EntryItemSkeleton />
	</div>
{:else if $query.isSuccess}
	<H1>{$query.data.title}</H1>
	<!-- {JSON.stringify($query.data)} -->
	<EntryList bind:active_id bulkForm={data.bulkForm} entries={$query.data.entries} />
{/if}
