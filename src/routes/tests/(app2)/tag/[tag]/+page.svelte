<script lang="ts">
	import PinButton from '$lib/components/PinButton.svelte';
	import { H1, Muted } from '$lib/components/ui/typography';
	import { MoreHorizontal, PlusCircle, TagIcon } from 'lucide-svelte';
	import type { Snapshot } from './$types.js';
	import * as Dropdown from '$components/ui/dropdown-menu';
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
	import * as Dialog from '$components/ui/dialog';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import Label from '$components/ui/Label.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { goto } from '$app/navigation';

	export let data;

	let loading = false;

	const tab = queryParam('tab', ssp.string(), { pushHistory: false });

	// TODO: form
	// const form = superForm(data.updateTagForm, {
	//     dataType: "json"
	// });

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
		onMutate({ name, color }) {
			queryClient.setQueryData<{ name: string; color: string }>(['tag', data.tag], (data) => {
				if (!data) return;
				return {
					...data,
					name: name ?? data.name,
					color: color ?? data.color
				};
			});
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

	let showRename = false;
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
				<Dropdown.Root>
					<Dropdown.Trigger>
						<MoreHorizontal class="h-6 w-6" />
					</Dropdown.Trigger>
					<Dropdown.Content>
						<Dropdown.Item
							on:m-click={() => {
								showRename = true;
								// todo updateTag tagUpdate
								// Dialog to rename? Or just make it editable?
							}}
						>
							Rename
						</Dropdown.Item>
						<Dropdown.Item
							on:m-click={() => {
								// todo deleteTag / tagDelete
							}}
						>
							Delete
						</Dropdown.Item>
					</Dropdown.Content>
				</Dropdown.Root>
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

<Dialog.Root bind:open={showRename}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Tag</Dialog.Title>
		</Dialog.Header>
		<form
			class="contents"
			on:submit|preventDefault={(e) => {
				if (!(e.target instanceof HTMLFormElement)) return;
				const data = new FormData(e.target);
				const name = data.get('tag-name');
				if (typeof name === 'string') {
					$updateTagMutation.mutateAsync({ name }).then(() => {
                        goto(`/tests/tag/${name}`);
                    })
				}
                showRename = false;
			}}
		>
			<Label for="tag-name">Tag Name</Label>
			<Input
				id="tag-name"
				type="text"
				autocomplete="off"
				name="tag-name"
				value={$tagDeetsQuery.data?.name}
			/>
			<Dialog.Footer>
				<Button type="submit">Save Changes</Button>
			</Dialog.Footer>
		</form>
		<!-- <Form.Root {form}>
			<form use:form.enhance class="contents" action='?/updateTag' method="post">
				<Form.Field name="tag-name" let:field>
					<Form.Item>
						<Form.Label>Tag Name</Form.Label>
					</Form.Item>
					<Input
						{...field()}
						id="tag-name"
						type="text"
						autocomplete="off"
						value={$tagDeetsQuery.data?.name}
					/>
				</Form.Field>
				<Dialog.Footer>
					<Button type="submit">Save Changes</Button>
				</Dialog.Footer>
			</form>
		</Form.Root> -->
	</Dialog.Content>
</Dialog.Root>
