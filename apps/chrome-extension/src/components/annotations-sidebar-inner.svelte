<script lang="ts">
	import { Tabs, Textarea } from '@margins/ui';
	import { getRPC } from './rpc-provider.svelte';
	import {
		createMutation,
		createQuery,
		useQueryClient,
	} from '@tanstack/svelte-query';
	import type { ServerMutations } from '@margins/features/replicache/server';
	import { SidebarAnnotation } from '@margins/features/notebook';
	import { createId } from '@margins/lib';
	import { chromeStorageLocal } from 'svelte-chrome-storage/dist';

	const tabs = ['annotations', 'page-notes'] as const;
	type Tab = (typeof tabs)[number];
	const tabsValue = chromeStorageLocal<Tab>('notebook-tabsValue');
	if (!$tabsValue) $tabsValue = 'annotations';

	$: console.log({ $tabsValue });

	export let entryID: string;
	const rpc = getRPC();
	const queryClient = useQueryClient();

	const notes = createQuery({
		queryFn: () => rpc.query('annotations_fromEntryId', { id: entryID }),
		queryKey: ['annotations', entryID],
	});

	const createNoteMutation = createMutation({
		mutationFn: (args: ServerMutations['annotation_create']['input']) =>
			rpc.mutate('annotation_create', args),
		onMutate: async (args) => {
			// TODO: optimistic update
		},
		onSuccess: () => {
			// weee
			queryClient.invalidateQueries({
				queryKey: ['annotations', entryID],
			});
		},
	});
</script>

<!-- TODO: insert ignore into entry with entry stuff -->
{#if $tabsValue}
	<Tabs.Root bind:value={$tabsValue}>
		<Tabs.List>
			<Tabs.Trigger value="annotations">Annotations</Tabs.Trigger>
			<Tabs.Trigger value="page-notes">Page Notes</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="annotations"></Tabs.Content>
		<Tabs.Content value="page-notes">
			<Textarea
				onSave={async (value) => {
					$createNoteMutation.mutate({
						body: value,
						entryId: entryID,
						id: createId(),
					});
				}}
				placeholder="Add a note…"
				class="bg-background-elevation w-full"
			/>

			<div class="mt-4 flex flex-col gap-2">
				{#each $notes.data ?? [] as note}
					<SidebarAnnotation annotation={note} />
				{/each}
			</div>
		</Tabs.Content>
	</Tabs.Root>
{/if}
