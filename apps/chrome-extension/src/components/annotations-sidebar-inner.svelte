<script lang="ts">
	import { Textarea } from '@margins/ui';
	import { getRPC } from './rpc-provider.svelte';
	import {
		createMutation,
		createQuery,
		useQueryClient,
	} from '@tanstack/svelte-query';
	import type { ServerMutations } from '@margins/features/replicache/server';
	import { createId } from '@margins/lib';
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
hello
{JSON.stringify(entryID)}

{#each $notes.data ?? [] as note}
	<div>{note.body}</div>
{/each}
