<script lang="ts">
	import { Option } from 'effect';
	import * as Entries from '../profile/Entries';
	import { useRxValue } from '../profile/rx.svelte';
	import Entry from './Entry.svelte';
	import NoEntryFound from './NoEntryFound.svelte';

	let { data } = $props();
	const entry = useRxValue(Entries.get(data.id));
</script>

{#if entry._tag === 'Success' && entry.value.ready}
	{#if Option.isSome(entry.value.data)}
		<Entry entry={entry.value.data.value} />
	{:else}
		<NoEntryFound />
	{/if}
{/if}
