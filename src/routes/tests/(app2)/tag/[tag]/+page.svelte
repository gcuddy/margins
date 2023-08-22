<script lang="ts">
	import PinButton from '$lib/components/PinButton.svelte';
	import { H1, Muted } from '$lib/components/ui/typography';
	import { PlusCircle, TagIcon } from 'lucide-svelte';
	import type { Snapshot } from './$types.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$components/ui/tabs';
	import Annotation from '$components/notebook/Annotation.svelte';
	import { page } from '$app/stores';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { tagDeets, tagEntries, tagNotes } from './queries';
	import { derived } from 'svelte/store';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import AnnotationSkeleton from '$components/notebook/AnnotationSkeleton.svelte';
	import EntryItemSkeleton from '$components/entries/EntryItemSkeleton.svelte';
	import EntryItem from '$components/entries/EntryItem.svelte';
	import { TagColorPopover } from '$components/tags/tag-color';
	import { mutation } from '$lib/queries/query';
	import type { UpdateTagInput } from '$lib/queries/server';
	import Header from '$components/ui/Header.svelte';
	import Button from '$components/ui/Button.svelte';

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

	const queryClient = useQueryClient();

	const updateTagMutation = createMutation({
		mutationFn: (data: UpdateTagInput['data']) => {
			if (!$tagDeetsQuery.isSuccess) {
				return Promise.reject('Tag not found');
			}
			return mutation($page, 'updateTag', {
				id: $tagDeetsQuery.data.id,
				data
			});
		},
		onMutate() {
			//  TODO optimsitically update pin color, if it exists
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['tags']
			});
			queryClient.invalidateQueries({
				queryKey: ['pins']
			});
		}
	});
</script>

<Header>
	<div class="flex items-center justify-between">
		{#if $tagDeetsQuery.isLoading}
			<Skeleton class="w-24 h-8" />
		{:else if $tagDeetsQuery.isSuccess}
			{@const tag = $tagDeetsQuery.data}

			<div class="flex items-center space-x-3">
				<!-- <TagIcon /> -->
				<TagColorPopover
					color={tag.color}
					on:change={({ detail: color }) => {
						console.log({ color });
						$updateTagMutation.mutate({ color });
					}}
				/>
				<span class="text-2xl font-bold tracking-tighter">
					{tag.name}
				</span>
			</div>
			<PinButton pin_id={tag.pin_id}>
				<input type="hidden" name="tag_id" value={tag.id} />
			</PinButton>
		{/if}
	</div>
</Header>
<Tabs>
	<Header class="h-auto static py-2">
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
	</Header>
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
			{:else}
				<div class="p-10 flex items-center justify-center flex-col gap-4">
                    <span>No notes for this tag.</span>
                    <Button variant="secondary" href="/tests/notes/new?tags={$tagDeetsQuery.data?.id ?? ''}">
                        <PlusCircle class="mr-2 h-4 w-4" />
                        New note for this tag
                    </Button>
                </div>
			{/each}
		{/if}
		<!-- {/await} -->
	</TabsContent>
</Tabs>
