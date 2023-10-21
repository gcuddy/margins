<script lang="ts">
	import type { EntryInteractions } from '$lib/queries/server';

	export let interactions: EntryInteractions;
	export let entry: SlimEntry;

	import * as Table from '$components/ui/table';
	import type { SlimEntry } from '$lib/utils/entries';
	import { formatDate } from '$lib/utils/date';

	import { StarFilled, Star, Symbol, TextAlignLeft, Pencil1 } from 'radix-icons-svelte';
	// import StarRating from '$components/ui/star-rating/star-rating.svelte';
	// import { createTable } from 'svelte-headless-table';
	// import { readable } from 'svelte/store';
	// import { addSelectedRows } from 'svelte-headless-table/lib/plugins';

	// const table = createTable(readable(interactions),{
	//     select: addSelectedRows(),
	// });

	// // TODO...

	// const columns = table.createColumns([
	//     table.column({
	//         accessor: "id",
	//     })
	// ])

	// TODO: make data table, give actions, etc.
</script>

<!-- big table, should have smaller groupings too -->

<Table.Root>
	<Table.Caption>A list of your activity with {entry.title}</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>Date</Table.Head>
			<Table.Head>Rating</Table.Head>
			<Table.Head>Re-visit</Table.Head>
			<Table.Head>Notes</Table.Head>
			<Table.Head>Edit</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each interactions.sort((a, b) => {
			// sort by createdat desc
			if (a.createdAt && b.createdAt) {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			} else if (a.createdAt) {
				return -1;
			} else if (b.createdAt) {
				return 1;
			} else {
				return 0;
			}
		}) as interaction}
			<Table.Row>
				<Table.Cell>
					{#if interaction.finished}
						{formatDate(interaction.finished, {
							month: 'numeric',
							year: 'numeric',
							day: 'numeric',
						})}
					{:else}
						-
					{/if}
				</Table.Cell>
				<Table.Cell
					>{#if interaction.rating}
						<div class="flex">
							{#each Array.from({ length: interaction.rating }) as _}
								<StarFilled />
							{/each}
							{#each Array.from({ length: 5 - interaction.rating }) as _}
								<Star class="opacity-20" />
							{/each}
						</div>
					{/if}
				</Table.Cell>
				<Table.Cell
					>{#if interaction.revisit}
						<Symbol class="rotate-90" />
					{/if}
				</Table.Cell>
				<Table.Cell
					>{#if interaction.note}
						<a href="/a/{interaction.id}">
							<TextAlignLeft />
						</a>
					{/if}</Table.Cell
				>
                <Table.Cell>
                    <a href="/a/{interaction.id}/edit">
                        <Pencil1 />
                    </a>
                </Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
