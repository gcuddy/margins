<script lang="ts">
	import { H1 } from '$lib/components/ui/typography';

	import Annotation from '$lib/components/notebook/Annotation.svelte';
	import type { PageData } from './$types';
	import Header from '$components/ui/Header.svelte';
	import * as Tabs from '$components/ui/tabs';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import Table from './Table.svelte';
	import { queryFactory } from '$lib/queries/querykeys';
	import { derived } from 'svelte/store';

	export let data: PageData;

    const queryClient = useQueryClient();
	const notesQuery = createQuery(
		queryFactory.notes.list({
			filter: {
				type: 'document'
			}
		}, queryClient)
	);

	$: console.log({ $notesQuery });

	const notesStore = derived(notesQuery, ($notesQuery) => $notesQuery.data?.notes ?? []);
</script>

<Header>
	<H1>Annotations</H1>
</Header>

<Tabs.Root>
	<Tabs.List>
		<Tabs.Trigger value="notes">Notes</Tabs.Trigger>
		<Tabs.Trigger value="annotations">Annotations</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="notes">
		{#if $notesQuery.isPending}
			loading..
		{:else if $notesQuery.isSuccess}
			<Table notes={notesStore} />
		{/if}
	</Tabs.Content>
	<Tabs.Content value="annotations">
		<!-- {#each data.notes.notes as annotation (annotation.id)}
			<Annotation {annotation} />
		{/each} -->
	</Tabs.Content>
</Tabs.Root>
