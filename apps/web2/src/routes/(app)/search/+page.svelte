<script lang="ts">
	import { getIdRx } from '$lib/worker/client';
	import type { Entry } from '@margins/api2/src/Domain/Entry';
	import { useRx, useRxSet, useRxValue } from '../profile/rx.svelte';

	let search = $state('');

	// $effect(() => {
	//     if (search) {
	//         getSearch(search)
	//     }
	// })
	const getSearch = useRxSet(getIdRx);
    let value: readonly string[] = $state([]);
	$effect(() => {
        console.log('search', search)
        // For some reason, have to do this. should figure it out...
        const res = useRxValue(getIdRx)
        if (res._tag === 'Success') {
            value = res.value
        }
        console.log('inside component', useRxValue(getIdRx))
        // TODO NEXT: use replicache to get entries
    })
</script>

<input type="text" placeholder="Search" bind:value={search} />

{search}

<button onclick={() => getSearch(search)}> search </button>

{JSON.stringify(value)}
