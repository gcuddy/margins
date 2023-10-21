<script lang="ts">
	import { q } from '$lib/queries/query';
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';
	import EntryIcon from './EntryIcon.svelte';
	import { make_link } from '$lib/utils/entries';

	export let title: string;
	export let author: string | null = null;
	export let enabled = false;

	const optsStore = writable({ title, author, enabled });

	$: if (enabled !== undefined || title !== undefined || author !== undefined) {
		optsStore.set({ title, author, enabled });
	}

	const query = createQuery(
		derived(optsStore, ({ title, author, enabled }) => ({
			enabled,
			queryFn: () => q('similarEntries', { title, author }),
			queryKey: ['similarEntries', { title, author }],
		})),
	);
</script>

{#if $query.data}
	<div class="flex flex-col gap-3">
		{#each $query.data as entry}
			<div class="flex gap-2">
				{#if entry.image}
					<img
						src={entry.image}
						class="w-12 shrink-0 h-12 shadow rounded cover"
						alt="Cover art for {entry.title}"
					/>
				{:else}
					<div
						class="w-12 h-12 shrink-0 shadow rounded bg-muted flex flex-col items-center justify-center"
					>
						<EntryIcon
							type={entry.type}
							class="w-5 h-5 text-muted-foreground"
						/>
					</div>
				{/if}
				<div class="text-sm flex flex-col justify-around">
					<a class="font-medium line-clamp-1" href={make_link(entry)}>{entry.title}</a>
					{#if entry.author}
						<p class="text-muted-foreground">{entry.author}</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<!-- <pre>{JSON.stringify($query.data, null, 2)}</pre> -->
{:else}{/if}
