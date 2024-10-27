<script lang="ts">
	import { getIdRx, Pool } from '$lib/worker/client';
	import { useRx, useRxSet, useRxValue } from '../profile/rx.svelte';
	import { Effect } from 'effect';
	import { Search } from '$lib/worker/schema';
	import { runtime } from '$lib/runtime';
	import EntryListItem from '$lib/components/entry-list-item.svelte';
	// import * as Entries from '../profile/Entries';
	import { Highlight } from '@orama/highlight';

	let search = $state('');
	console.log({ getIdRx });

	// // $effect(() => {
	// //     if (search) {
	// //         getSearch(search)
	// //     }
	// // })

	const getSearch = useRxSet(getIdRx);
	const { value, set } = useRx(getIdRx);

	const searchEffect = (q: string) =>
		Pool.pipe(Effect.flatMap((pool) => pool.executeEffect(new Search({ q }))));

	const highlighter = new Highlight({
		HTMLTag: 'span',
		CSSClass: 'entry-list-item-highlight'
	});

	const promise = $derived(runtime.runPromise(searchEffect(search)));
	// $inspect(promise);

	// // const
	// // const results = useRxSet(getIdRx);
	// $effect(() => {
	// 	getSearch(search);
	// });
	// // $effect(() => {
	// // 	set(search);
	// // });
	// $inspect(value);
	// $effect(() => {
	// 	console.log('SEARCH PAGE');
	// 	const v = value();
	// 	console.log({ v });
	// });
	// // $effect(() => {
	// // 	console.log({ results });
	// // 	console.log({ value });
	// // 	console.log({ set });
	// // });
	// // const entries = useRxValue(Entries.effect);
	// // console.log({ entries });
	// // let value: readonly string[] = $state([]);
	// // const res = useRxValue(getIdRx);
	// // const results = $derived.by(() => {
	// // 	getSearch;
	// // 	res;
	// // 	console.log("deriving")
	// // 	if (res._tag === 'Success' && entries._tag === 'Success' && entries.value.ready) {
	// // 		// lol there's gotta be a better way...
	// // 		return res.value
	// // 			.map((id) => entries.value.data.find((entry) => entry.id === id))
	// // 			.filter(Boolean);
	// 	}
	// 	return [];
	// });
	// $effect(() => {
	// 	console.log('search', search);
	// 	// For some reason, have to do this. should figure it out...
	// 	const res = useRxValue(getIdRx);
	// 	if (res._tag === 'Success') {
	// 		value = res.value;
	// 	}
	// 	console.log('inside component', useRxValue(getIdRx));
	// 	// TODO NEXT: use replicache to get entries
	// });
</script>

<input type="text" placeholder="Search" bind:value={search} />

{#await promise}
	loading...
{:then results}
	{results.count} results
	<div class="flex flex-col">
		{#each results.hits as hit (hit.id)}
			<EntryListItem
				title={hit.document.title ?? ''}
				author={hit.document.author ?? ''}
				imageSrc={hit.document.image ?? ''}
				href={`/${hit.id}`}
			>
				{#snippet titleSnippet()}
					{@const highlighted = highlighter.highlight(hit.document.title ?? '', search)}
					{@html highlighted.HTML}
				{/snippet}
				{#snippet authorSnippet()}
					{@const highlighted = highlighter.highlight(hit.document.author ?? '', search)}
					{@html highlighted.HTML}
				{/snippet}

				{#snippet bodySnippet()}
					{@const highlighted = highlighter.highlight(hit.document.text ?? '', search)}
					{#if highlighted.positions.length}
						{@html highlighted.trim(100)}
					{/if}
				{/snippet}
			</EntryListItem>
		{/each}
	</div>
{:catch error}
	{JSON.stringify(error)}
{/await}

<!-- {results ? JSON.stringify(results) : 'no results'} -->

<!-- <button onclick={() => getSearch(search)}> search </button>

{JSON.stringify(entries)} -->
