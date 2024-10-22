<script lang="ts">
	import { getIdRx, Pool } from '$lib/worker/client';
	import { useRx, useRxSet, useRxValue } from '../profile/rx.svelte';
	import { Effect } from 'effect';
	import { Search } from '$lib/worker/schema';
	import { runtime } from '$lib/runtime';
	// import * as Entries from '../profile/Entries';

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

{search}
{#await promise}
	loading...
{:then results}
	{JSON.stringify(results)}
{:catch error}
	{JSON.stringify(error)}
{/await}

<!-- {results ? JSON.stringify(results) : 'no results'} -->

<!-- <button onclick={() => getSearch(search)}> search </button>

{JSON.stringify(entries)} -->
