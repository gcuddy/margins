<script lang="ts">
	import PinButton from '$lib/components/PinButton.svelte';
	import EntryList from '$lib/components/entries/EntryList.svelte';
	import { H1, Muted } from '$lib/components/ui/typography';
	import { TagIcon } from 'lucide-svelte';
	import type { Snapshot } from './$types.js';
	import { createTabsContext } from '$components/ui/tabs/utils';
	import { TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
	import Annotation from '$components/notebook/Annotation.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { createQuery } from '@tanstack/svelte-query';
	import { query } from '$lib/queries/query';
	import { tagDeets, tagEntries, tagNotes } from './queries';
	import { derived } from 'svelte/store';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import AnnotationSkeleton from '$components/notebook/AnnotationSkeleton.svelte';

	export let data;
	let entrylist: EntryList;
	export const snapshot: Snapshot = {
		capture: () => entrylist?.capture(),
		restore: (snapshot) => entrylist?.restore(snapshot)
	};

	let loading = false;

	const tab = queryParam('tab', ssp.string(), { pushHistory: false });

	const { root, value } = createTabsContext({
		value: 'entries',
		onChange: (value) => {
			tab.set(value);
		}
	});

	const tagDeetsQuery = createQuery(tagDeets($page, data.tag));
	const entriesQuery = createQuery(
		derived(page, ($page) => ({
			...tagEntries($page, data.tag),
			// enabled: $page.url.searchParams.get('tab') !== 'notes'
		}))
	);
	const notesQuery = createQuery(
		derived(page, ($page) => ({
			...tagNotes($page, data.tag),
			// enabled: $page.url.searchParams.get('tab') === 'notes'
		}))
	);
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		{#if $tagDeetsQuery.isLoading}
			<Skeleton class="w-24 h-8" />
		{:else if $tagDeetsQuery.isSuccess}
			{@const tag = $tagDeetsQuery.data}

			<H1 class="flex items-baseline space-x-3">
				<TagIcon />
				<span>
					{tag.name}
				</span>
			</H1>
			<PinButton pin_id={tag.pin_id}>
				<input type="hidden" name="tag_id" value={tag.id} />
			</PinButton>
		{/if}
	</div>
	<div melt={$root}>
		<TabsList>
			<TabsTrigger class="gap-1.5" value="entries"
				><span>Entries</span>
				<Muted>{$entriesQuery.data ? $entriesQuery.data.length : ''}</Muted></TabsTrigger
			>
			<TabsTrigger class="gap-1.5" value="notes"
				><span>Notes</span>
				<Muted>{$notesQuery.data ? $notesQuery.data.length : ''}</Muted>
				<!-- {#await data.lazy.notes then notes}<Muted>{notes.length}</Muted>{/await} -->
			</TabsTrigger>
		</TabsList>
		<TabsContent value="entries">
			<EntryList
				class="mt-8"
				bulkForm={data.bulkForm}
				loading={$entriesQuery.isLoading}
				entries={$entriesQuery.data ?? []}
				on:end={async () => {
					// if (loading || !data.nextCursor) return;
					// loading = true;
					// const response = await fetch(
					// 	`/api/entries/tag/${data.tag.name}?cursor=${data.nextCursor}`
					// );
					// const result = await response.json();
					// //@ts-ignore
					// data.entries = [...data.entries, ...result.entries];
					// data.nextCursor = result.nextCursor;
					// loading = false;
				}}
			/></TabsContent
		>
		<TabsContent value="notes">
			<!-- {#await data.lazy.notes}
				loading...
			{:then notes} -->
			{#if $notesQuery.isLoading}
				<AnnotationSkeleton />
			{:else if $notesQuery.isSuccess}
				{#each $notesQuery.data as note}
					<Annotation annotation={note} />
				{/each}
			{/if}
			<!-- {/await} -->
		</TabsContent>
	</div>
</div>
