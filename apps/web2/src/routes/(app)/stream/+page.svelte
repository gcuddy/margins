<script lang="ts">
	import { annotations, annotationsEffect } from '$lib/services/Annotations';
	import { stream, streamFn } from '$lib/services/replicache-store.svelte';
	import { useRxSet, useRxValue } from '../profile/rx.svelte';
	import Suspense from './suspense.svelte';

	// const value = useRxValue(streamFn('annotations'));
	const value = useRxValue(annotations);
	const entries = useRxValue(annotationsEffect);

	// function add(e: Event) {
	// 	const data = new FormData(e.currentTarget as HTMLFormControlsCollection);

	// 	console.log({ data });
	// }

	$effect(() => {
		value;
		console.log('values', $state.snapshot(value));
		console.log('entries', $state.snapshot(entries));
	});
</script>

{JSON.stringify(value)}

{#if value.value._tag === 'Success'}
	{value.value.value.items.map((item) => JSON.stringify(item))}
	<!-- {value.value.value.items.map((item) => JSON.stringify(item))} -->
{/if}

<form>
	<input type="text" />
	<button>add</button>
</form>
