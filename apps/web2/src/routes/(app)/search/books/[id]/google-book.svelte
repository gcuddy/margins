<script lang="ts">
	import EntryListItem from '$lib/components/entry-list-item.svelte';
	import { makeClient } from '$lib/rpc';
	import { runtime } from '$lib/runtime';
	import Heading from '$lib/ui/heading.svelte';
	import Text from '$lib/ui/text.svelte';
	import {
		GoogleBooksGet,
		GoogleBooksSearch,
		GoogleBookVolume
	} from '@margins/api2/src/Rpc/Integrations/GoogleBooks/schema';
	import { Effect } from 'effect';

	let { id }: { id: string } = $props();
	console.log('id', id);

	const main = (id: string) =>
		Effect.gen(function* () {
			const client = yield* makeClient;
			const volumes = yield* client(
				new GoogleBooksGet({
					id
				})
			).pipe(Effect.tapErrorCause(Effect.logError));
			return volumes;
		});

	const promise = $derived(runtime.runPromise(main(id)));
</script>

{#await promise}
	Loading...
{:then book}
	{#if book.volumeInfo}
		<div class="overflow-auto flex flex-col px-4 py-2 select-text">
			<div class="flex justify-center gap-4">
				<img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
				<div class="flex flex-col gap-2">
					<Heading>{book.volumeInfo.title}</Heading>
					<Text>{book.volumeInfo.authors?.join(', ')}</Text>
				</div>
			</div>
		</div>
	{:else}
		No book found
	{/if}
{:catch error}
	{error}
{/await}
