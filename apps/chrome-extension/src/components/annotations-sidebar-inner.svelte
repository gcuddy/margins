<script lang="ts">
	import { Tabs, Textarea } from '@margins/ui';
	import { getRPC } from './rpc-provider.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { ServerMutations } from '@margins/features/replicache/server';
	import { SidebarAnnotation } from '@margins/features/notebook';
	import { createId } from '@margins/lib';
	import { chromeStorageLocal } from 'svelte-chrome-storage/dist';
	import { useCreateNoteMutation } from '../data/mutations';
	import { useNotesQuery } from '../data/queries';
	import { derived } from 'svelte/store';

	const tabs = ['annotations', 'page-notes'] as const;
	type Tab = (typeof tabs)[number];
	const tabsValue = chromeStorageLocal<Tab>('notebook-tabsValue');
	if (!$tabsValue) $tabsValue = 'annotations';

	export let entryID: string;
	const rpc = getRPC();
	const queryClient = useQueryClient();

	const notes = useNotesQuery(entryID);

	const annotations = derived(notes, ($notes) => {
		return $notes.data?.filter((note) => note.type === 'annotation') ?? [];
	});
	const pageNotes = derived(notes, ($notes) => {
		return $notes.data?.filter((note) => note.type === 'note') ?? [];
	});

	type CreateNoteInput = ServerMutations['annotation_create']['input'];
	const createNoteMutation = useCreateNoteMutation(entryID);

	export function createNote(args: CreateNoteInput) {
		$createNoteMutation.mutate(args);
	}

	function handleHighlight() {
		const hey = 'hello';
		const selection = window.getSelection();
	}
</script>

<!-- TODO: insert ignore into entry with entry stuff -->
{#if $tabsValue}
	<Tabs.Root bind:value={$tabsValue}>
		<Tabs.List>
			<Tabs.Trigger value="annotations">Annotations</Tabs.Trigger>
			<Tabs.Trigger value="page-notes">Page Notes</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="annotations">
			<div class="mt-4 flex flex-col gap-2">
				{#each $annotations as annotation}
					<SidebarAnnotation {annotation} />
				{/each}
			</div>
		</Tabs.Content>
		<Tabs.Content value="page-notes">
			<Textarea
				onSave={async (value) => {
					$createNoteMutation.mutate({
						body: value,
						entryId: entryID,
						id: createId(),
						type: 'note',
					});
				}}
				placeholder="Add a note…"
				class="bg-background-elevation w-full"
			/>

			<div class="mt-4 flex flex-col gap-2">
				{#each $pageNotes as note}
					<SidebarAnnotation annotation={note} />
				{/each}
			</div>
		</Tabs.Content>
	</Tabs.Root>
{/if}
