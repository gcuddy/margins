<script lang="ts">
	import { Option } from 'effect';
	import * as Entries from '$lib/services/Entries';
	import { useRxValue } from '../profile/rx.svelte';
	import Entry from './Entry.svelte';
	import NoEntryFound from './NoEntryFound.svelte';

	let { data } = $props();
	const entry = useRxValue(Entries.get(data.id));

	const x = $derived(data.id.toUpperCase());

	$effect(() => {
		console.log({ data });
		console.log({ entry });
		console.log({ x });
	});
</script>

{JSON.stringify(entry)}
{#if entry._tag === 'Success'}
	{entry.value.get(data.id)}
{/if}

<!-- {#if entry._tag === 'Success' && entry.value} -->
<!-- 	{#if Option.isSome(entry.value.data)} -->
<!-- 		<Entry entry={entry.value.data.value} /> -->
<!-- 	{:else} -->
<!-- 		<NoEntryFound /> -->
<!-- 	{/if} -->
<!-- {/if} -->
