<script lang="ts">
	import PinButton from '$lib/components/PinButton.svelte';
	import { H1, Muted } from '$lib/components/ui/typography';
	import { TagIcon } from 'lucide-svelte';
	import type { Snapshot } from './$types.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
	import Annotation from '$components/notebook/Annotation.svelte';
	import { page } from '$app/stores';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { tagDeets, tagEntries, tagNotes } from './queries';
	import { derived } from 'svelte/store';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import AnnotationSkeleton from '$components/notebook/AnnotationSkeleton.svelte';
	import EntryItemSkeleton from '$components/entries/EntryItemSkeleton.svelte';
	import EntryItem from '$components/entries/EntryItem.svelte';
	import { TagColor } from '$components/tags/tag-color';
	import { mutation } from '$lib/queries/query';
	import type { UpdateTagInput } from '$lib/queries/server';

	export let data;

	let loading = false;

	const tab = queryParam('tab', ssp.string(), { pushHistory: false });

	const tagDeetsQuery = createQuery(tagDeets($page, data.tag));
	const entriesQuery = createQuery(
		derived(page, ($page) => ({
			...tagEntries($page, data.tag)
			// enabled: $page.url.searchParams.get('tab') !== 'notes'
		}))
	);
	const notesQuery = createQuery(
		derived(page, ($page) => ({
			...tagNotes($page, data.tag)
			// enabled: $page.url.searchParams.get('tab') === 'notes'
		}))
	);

	const updateTagMutation = createMutation({
		mutationFn: (data: UpdateTagInput['data']) => {
			if (!$tagDeetsQuery.isSuccess) {
				return Promise.reject('Tag not found');
			}
			return mutation($page, 'updateTag', {
				id: $tagDeetsQuery.data.id,
				data
			});
		}
	});
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		{#if $tagDeetsQuery.isLoading}
			<Skeleton class="w-24 h-8" />
		{:else if $tagDeetsQuery.isSuccess}
			{@const tag = $tagDeetsQuery.data}

			<H1 class="flex items-center space-x-3">
				<TagIcon />
				<TagColor
					color={tag.color}
					on:change={({ detail: color }) => {
                        console.log({color})
						$updateTagMutation.mutate({ color });
					}}
				/>
				<span>
					{tag.name}
				</span>
			</H1>
			<PinButton pin_id={tag.pin_id}>
				<input type="hidden" name="tag_id" value={tag.id} />
			</PinButton>
		{/if}
	</div>
	<Tabs>
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
			{#if $entriesQuery.isLoading}
				<EntryItemSkeleton />
			{:else if $entriesQuery.isSuccess}
				{#each $entriesQuery.data as entry}
					<EntryItem {entry} />
				{/each}
			{/if}
		</TabsContent>
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
	</Tabs>
</div>
