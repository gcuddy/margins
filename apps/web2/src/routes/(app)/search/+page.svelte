<script lang="ts">
	import { getIdRx } from '$lib/worker/client';
	import type { Entry } from '@margins/api2/src/Domain/Entry';
	import { useRx, useRxSet, useRxValue } from '../profile/rx.svelte';
	import * as Entries from '../profile/Entries';

	let search = $state('');

	// $effect(() => {
	//     if (search) {
	//         getSearch(search)
	//     }
	// })
	const getSearch = useRxSet(getIdRx);
	const entries = useRxValue(Entries.effect);
	console.log({ entries });
	let value: readonly string[] = $state([]);
	const res = useRxValue(getIdRx);
	const results = $derived.by(() => {
		getSearch;
		res;
		console.log("deriving")
		if (res._tag === 'Success' && entries._tag === 'Success' && entries.value.ready) {
			// lol there's gotta be a better way...
			return res.value
				.map((id) => entries.value.data.find((entry) => entry.id === id))
				.filter(Boolean);
		}
		return [];
	});
	$effect(() => {
		console.log('search', search);
		// For some reason, have to do this. should figure it out...
		const res = useRxValue(getIdRx);
		if (res._tag === 'Success') {
			value = res.value;
		}
		console.log('inside component', useRxValue(getIdRx));
		// TODO NEXT: use replicache to get entries
	});
</script>

<input type="text" placeholder="Search" bind:value={search} />

{search}

<button onclick={() => getSearch(search)}> search </button>

{JSON.stringify(entries)}
