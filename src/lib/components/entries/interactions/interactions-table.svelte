<script lang="ts">
	import type { EntryInteractions } from '$lib/queries/server';

	export let interactions: EntryInteractions;
	export let entry: SlimEntry;

	import * as Table from '$components/ui/table';
	import type { SlimEntry } from '$lib/utils/entries';
	import { formatDate } from '$lib/utils/date';
</script>

<!-- big table, should have smaller groupings too -->

<Table.Root>
	<Table.Caption>A list of your activity with {entry.title}</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>Date finished</Table.Head>
			<Table.Head>Rating</Table.Head>
			<Table.Head>Re-visit</Table.Head>
			<Table.Head>Notes</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each interactions as interaction}
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
				<Table.Cell>{interaction.rating}</Table.Cell>
				<Table.Cell>{interaction.revisit}</Table.Cell>
				<Table.Cell>{interaction.note}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
