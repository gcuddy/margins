<script lang="ts">
	import EntryListItem from '$lib/components/entry-list-item.svelte';
	import { makeClient } from '$lib/rpc';
	import { runtime } from '$lib/runtime';
	import {
		GoogleBooksSearch,
		GoogleBookVolume
	} from '@margins/api2/src/Rpc/Integrations/GoogleBooks/schema';
	import { Effect } from 'effect';

	let { query }: { query: string } = $props();

	const main = (query: string) =>
		Effect.gen(function* () {
			const client = yield* makeClient;
			console.log('running main for query', { query });
			const volumes = yield* client(
				new GoogleBooksSearch({
					query
				})
			).pipe(Effect.tapErrorCause(Effect.logError));
			console.log({ volumes });
			return volumes;
		});

	const promise = $derived(runtime.runPromise(main(query)));
</script>

{#snippet item(item: GoogleBookVolume)}
	<EntryListItem
		href={`/search/books/${item.id}`}
		class="py-2 px-4"
		image={item.volumeInfo.imageLinks?.thumbnail ?? ''}
		title={item.volumeInfo.title ?? ''}
		author={item.volumeInfo.authors?.join(', ') ?? ''}
	/>
{/snippet}

{#await promise}
	Loading...
{:then volumes}
	{#if !volumes.items}
		No results
	{:else}
		<div class="flex flex-col -mt-2">
			{#each volumes.items as i}
				{@render item(i)}
			{/each}
		</div>
	{/if}
{:catch error}
	{JSON.stringify(error)}
{/await}
