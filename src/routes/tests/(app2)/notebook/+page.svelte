<script lang="ts">
	import { H1 } from '$lib/components/ui/typography';

	import Annotation from '$lib/components/notebook/Annotation.svelte';
	import type { PageData } from './$types';
	import Header from '$components/ui/Header.svelte';
	import * as Tabs from '$components/ui/tabs';
	import { createQuery } from '@tanstack/svelte-query';
	import { queryFactory } from '$lib/queries/querykeys';

	export let data: PageData;


    const notesQuery = createQuery(queryFactory.notes.list({
        filter: {
            type: "note"
        }
    }))
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
            <pre>{JSON.stringify($notesQuery.data, null, 2)}</pre>
        {/if}
	</Tabs.Content>
	<Tabs.Content value="annotations">
		{#each data.notes.notes as annotation (annotation.id)}
			<Annotation {annotation} />
		{/each}
	</Tabs.Content>
</Tabs.Root>
