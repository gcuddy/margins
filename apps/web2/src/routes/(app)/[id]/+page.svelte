<script lang="ts">
	import * as Entries from '$lib/services/Entries';
	import { useRxValue } from '../profile/rx.svelte';
	import Entry from './Entry.svelte';
	import NoEntryFound from './NoEntryFound.svelte';
	import Suspense from '../stream/suspense.svelte';
	import { Option as O } from 'effect';
	import Option from '../stream/option.svelte';

	let { data } = $props();
	const entry = useRxValue(Entries.get(data.id));
</script>

<Suspense rx={Entries.get(data.id)}>
	{#snippet fallback()}
		Loading...
	{/snippet}
	{#snippet children({ value })}
		<Option option={value.get(data.id).pipe(O.map((a) => a.value))}>
			{#snippet some(entry)}
				<Entry {entry} />
			{/snippet}
			<!-- todo: check if scan is done before showing this -->
			{#snippet none()}
				<NoEntryFound />
			{/snippet}
		</Option>
	{/snippet}
</Suspense>
