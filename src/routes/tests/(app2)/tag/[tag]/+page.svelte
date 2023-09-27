<script lang="ts">
	import {
		createInfiniteQuery,
		createMutation,
		createQuery,
		useQueryClient,
	} from '@tanstack/svelte-query';
	import { MoreHorizontal, PlusCircle } from 'lucide-svelte';
	import { derived } from 'svelte/store';
	import { toast } from 'svelte-sonner';

	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EntryItem from '$components/entries/EntryItem.svelte';
	import EntryItemSkeleton from '$components/entries/EntryItemSkeleton.svelte';
	import Annotation from '$components/notebook/Annotation.svelte';
	import AnnotationSkeleton from '$components/notebook/AnnotationSkeleton.svelte';
	import { TagColorPopover } from '$components/tags/tag-color';
	import * as AlertDialog from '$components/ui/alert-dialog';
	import Button from '$components/ui/Button.svelte';
	import * as Dialog from '$components/ui/dialog';
	import * as Dropdown from '$components/ui/dropdown-menu';
	import Header from '$components/ui/Header.svelte';
	import { Input } from '$components/ui/input';
	import Label from '$components/ui/Label.svelte';
	import {
		Tabs,
		TabsContent,
		TabsList,
		TabsTrigger,
	} from '$components/ui/tabs';
	import PinButton from '$lib/components/PinButton.svelte';
	import { Muted } from '$lib/components/ui/typography';
	import { mutation } from '$lib/queries/query';
	import type { UpdateTagInput } from '$lib/queries/server';

	import { tagEntries, tagNotes } from './queries';

	export let data;

	$: ({ tagDetails: tag } = data);

	// TODO: form
	// const form = superForm(data.updateTagForm, {
	//     dataType: "json"
	// });

	const entriesQuery = createInfiniteQuery(
		derived(page, ($page) => ({
			...data.entriesQueryOpts(data.tagDetails.id),
			// enabled: $page.url.searchParams.get('tab') !== 'notes'
		})),
	);

	const entries = derived(entriesQuery, ($query) => {
		if (!$query.data) {
			return [];
		}
		return $query.data.pages.flatMap((page) => page.entries);
	});

	const notesQuery = createQuery(
		derived(page, ($page) => ({
			...tagNotes($page, data.tag),
			// enabled: $page.url.searchParams.get('tab') === 'notes'
		})),
	);

	const queryClient = useQueryClient();

	const updateTagMutation = createMutation({
		mutationFn: (data: UpdateTagInput['data']) => {
			return mutation($page, 'updateTag', {
				data,
				id: tag.id,
			});
		},
		onMutate({ color, name }) {
			queryClient.setQueryData<{ color: string; name: string }>(
				['tag', data.tag],
				(data) => {
					if (!data) {
						return;
					}
					return {
						...data,
						color: color ?? data.color,
						name: name ?? data.name,
					};
				},
			);
			//  TODO optimsitically update pin color, if it exists
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['tags'],
			});
			queryClient.invalidateQueries({
				queryKey: ['pins'],
			});
		},
	});

	let showRename = false;
	let showDelete = false;
</script>

<Header>
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-3">
			<!-- <TagIcon /> -->
			<TagColorPopover
				color={tag.color}
				on:change={({ detail: color }) => {
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
						on:click={() => {
							showRename = true;
							// todo updateTag tagUpdate
							// Dialog to rename? Or just make it editable?
						}}
					>
						Rename
					</Dropdown.Item>
					<!-- TODO: only show if we actually have no tags... -->
					<Dropdown.Item
						on:click={() => {
							showDelete = true;
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
	</div>
</Header>
<Tabs>
	<Header class="h-auto static py-2">
		<TabsList>
			<TabsTrigger class="gap-1.5" value="entries"
				><span>Entries</span>
				<Muted>{$entries ? $entries.length : ''}</Muted></TabsTrigger
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
			{#each $entries as entry}
				<EntryItem {entry} />
			{/each}
			<!-- TODO: virtualize (using existing component) and infinite scroll (see [status]/+page.svelte) -->
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
					<Button variant="secondary" href="/tests/notes/new?tags={tag.id}">
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
				if (!(e.target instanceof HTMLFormElement)) {
					return;
				}
				const data = new FormData(e.target);
				const name = data.get('tag-name');
				if (typeof name === 'string') {
					$updateTagMutation.mutateAsync({ name }).then(() => {
						goto(`/tests/tag/${name}`);
					});
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
				value={tag.name}
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

<AlertDialog.Root bind:open={showDelete}>
	<AlertDialog.Content>
		<form
			class="contents"
			method="post"
			action="?/delete"
			use:enhance={() => {
				return async ({ result, update }) => {
					await update();
					if (result.type === 'success' || result.type === 'redirect') {
						toast.success('Tag deleted');
					}
				};
			}}
		>
			<AlertDialog.Header>
				<AlertDialog.Title>Delete Tag</AlertDialog.Title>
				<AlertDialog.Description>
					Are you sure you want to delete this tag?
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action type="submit">Delete</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
