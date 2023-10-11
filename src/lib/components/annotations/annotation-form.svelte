<script lang="ts">
	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import Editor from '$components/ui/editor/Editor.svelte';
	import { type MutationInput, mutate } from '$lib/queries/query';
	import type { UpsertAnnotationInput } from '$lib/queries/server';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import type { JSONContent } from '@tiptap/core';
	import { createEventDispatcher } from 'svelte';

	export let autofocus = false;
	// export let showMaximize = true;

	export let annotationId: string | undefined = undefined;
	export let entryId: number | undefined = undefined;

	export let type: UpsertAnnotationInput['type'] = 'note';
    export let media: UpsertAnnotationInput["media"] = undefined;

	const dispatch = createEventDispatcher();
	const queryClient = useQueryClient();
	const mutation = createMutation({
		mutationFn: (input: MutationInput<'save_note'>) =>
			mutate('save_note', input),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['entries'],
			});
			queryClient.invalidateQueries({
				queryKey: ['notes'],
			});
            dispatch('save', { content });
		},
	});

	function cancel() {
		dispatch('cancel');
	}

	function save() {
        $mutation.mutate({
            id: annotationId,
			entryId: entryId,
			contentData: content,
            media,
            type
		});

	}

	// function maximize() {
	// 	isDialogOpen = true;
	// 	dispatch('maximize');
	// }

	let content: JSONContent;

	let isDialogOpen = false;
</script>

<div
	class="border flex flex-col relative rounded-md py-3 px-4 bg-card focus-within:shadow-md border-input shadow transition"
>
	<!-- Header -->
	<!-- TODO -->
	<!-- <div class="flex absolute top-3 z-10 right-4">
		<Button on:click={maximize} size="icon" class="h-6 w-6" variant="ghost">
			<Maximize2 class="h-3 w-3" />
		</Button>
	</div> -->

    <!-- store data in entryId -->
	<Editor
		onUpdate={(e) => {
			content = e.editor.getJSON();
		}}
		class="border-0 p-0"
		{autofocus}
		focusRing={false}
	/>
	<!-- Footer -->
	<div class="flex justify-end gap-2">
		<Button variant="ghost" size="sm" on:click={cancel}>Cancel</Button>
		<Button variant="secondary" size="sm" on:click={save}>Save</Button>
	</div>
</div>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content>
		<Editor />
	</Dialog.Content>
</Dialog.Root>
