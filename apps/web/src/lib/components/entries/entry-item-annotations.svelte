<script lang="ts">
	import MiniAnnotation from '$components/annotations/mini-annotation.svelte';
	import * as Collapsible from '$components/ui/collapsible';
	import { queryFactory } from '$lib/queries/querykeys';
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';

	export let entryId: number;
	export let enabled = writable(true);

	const entryIdStore = writable(entryId);

	$: entryIdStore.set(entryId);

	const query = createQuery(
		derived([entryIdStore, enabled], ([id, enabled]) => ({
			...queryFactory.entries.annotations({ id }),
			enabled,
		})),
	);

	let isCollapsibleOpen = false;
</script>

{#if $query.isPending}
	Loading...
{:else if $query.error}
	An error has occured: {$query.error.message}
{:else}
	<Collapsible.Root
		bind:open={isCollapsibleOpen}
		class="max-h-80 overflow-auto space-y-1"
	>
		<div class="space-y-1">
            {#each $query.data.slice(0, 3) as annotation}
                <MiniAnnotation {annotation} />
            {/each}
        </div>
		{#if $query.data.length > 3}
			<Collapsible.Content class="space-y-1">
				{#each $query.data.slice(3) as annotation}
					<MiniAnnotation {annotation} />
				{/each}
			</Collapsible.Content>
			<Collapsible.Trigger>
				<button
					class="text-xs text-muted-foreground hover:text-muted-foreground-hover"
				>
					{#if !isCollapsibleOpen}
						{#if $query.data.length === 4}
							1 more annotation
						{:else}
							{$query.data.length - 3} more annotations
						{/if}
					{:else}
						Show less
					{/if}
				</button>
			</Collapsible.Trigger>
		{/if}
	</Collapsible.Root>
{/if}
