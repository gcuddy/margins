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
	import { receive, send } from '../../../../../lib/transition';
	import { main } from './effect';

	let { id }: { id: string } = $props();

	const promise = $derived(runtime.runPromise(main(id)));
</script>

{#await promise}
	Loading...
{:then book}
	{#if book.volumeInfo}
		<div class="overflow-auto flex flex-col px-4 py-2 select-text">
			<div class="flex flex-col gap-4">
				<!-- TODO: figure out why in/out not working -->
				<div class="flex m-4 relative justify-center">
					<img
						class="w-[100px] h-auto rounded-2"
						src={book.volumeInfo.imageLinks?.thumbnail}
						alt={book.volumeInfo.title}
						in:send={{ key: `image-${book.id}` }}
						out:receive={{ key: `image-${book.id}` }}
					/>
				</div>
				<header class="flex flex-col justify-center text-pretty text-center gap-2 mb-3">
					<Heading as="h3" size="6" class=" text-center text-pretty">
						{book.volumeInfo.title}
					</Heading>
					<Text size="4" color="gray" as="div">
						{book.volumeInfo.authors?.join(', ')}
					</Text>
				</header>
				<div class="max-w-prose flex justify-center mx-auto text-center">
					<!-- TODO: line clamp component, that shows full either as dialog or expanded. Clamps at line break or first n lines, whichever comes first. -->
					<Text as="p" color="gray" size="2" class="text-center mb-4">
						{@html book.volumeInfo.description}
					</Text>
				</div>
			</div>
		</div>
	{:else}
		No book found
	{/if}
{:catch error}
	{error}
{/await}
