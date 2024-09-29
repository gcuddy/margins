<script lang="ts">
	import {
		annotations,
		annotationsEffect,
		subscription,
		subscription2,
		annotationsFindContent3
		// annotationsFindContent4
	} from '$lib/services/Annotations';
	import { stream, streamFn } from '$lib/services/replicache-store';
	import { useRx, useRxSet, useRxValue } from '../profile/rx.svelte';
	import Suspense from './suspense.svelte';

	// const value = useRxValue(streamFn('annotations'));
	// const value = useRxValue(annotations);
	// const entries = useRxValue(annotationsEffect);
	// const subscriptionValue = useRx(subscription);
	// const subscriptionValue2 = useRx(subscription2);
	const storeValue = useRxValue(annotationsFindContent3);
	$inspect(storeValue).with(console.trace);
	$effect(() => {
		console.log($state.snapshot(storeValue));
	});

	const arr = $derived.by(() => {
		if (storeValue._tag === 'Success') {
			console.log('storevalue success');
			// return storeValue.value.value.toArray();
		}
	});

	$inspect(arr);

	// function add(e: Event) {
	// 	const data = new FormData(e.currentTarget as HTMLFormControlsCollection);

	// 	console.log({ data });

	// $inspect(subscriptionValue).with(console.trace);
	// $inspect(subscriptionValue2).with(console.trace);
	// //
	// $effect(() => {
	// 	// value;
	// 	// console.log('values', $state.snapshot(value));
	// 	// console.log('entries', $state.snapshot(entries));
	// 	// console.log('subscriptionValue', $state.snapshot(subscriptionValue));
	// 	console.log('subscriptionValue2', $state.snapshot(subscriptionValue2));
	// });
</script>

{JSON.stringify(storeValue._tag === 'Success' && storeValue.value.arr)}

<!-- {#if value.value._tag === 'Success'} -->
<!-- {value.value.value.items.map((item) => JSON.stringify(item))} -->
<!-- {value.value.value.items.map((item) => JSON.stringify(item))} -->
<!-- {/if} -->

<form>
	<input type="text" />
	<button>add</button>
</form>
