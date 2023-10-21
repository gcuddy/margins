<script lang="ts">
	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import Editor from '$components/ui/editor/Editor.svelte';
	import { cn } from '$lib';
	import {
		invalidateEntries,
		updateAnnotationMutation,
	} from '$lib/queries/mutations';
	import { mutate } from '$lib/queries/query';
	import type { UpsertAnnotationInput } from '$lib/queries/server';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { JSONContent } from '@tiptap/core';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	export let autofocus = false;
	// export let showMaximize = true;

	export let annotationId: string | undefined = undefined;
	export let entryId: number | number[] | undefined = undefined;

	export let type: UpsertAnnotationInput['type'] = 'note';
	export let media: UpsertAnnotationInput['media'] = undefined;
	export let target: UpsertAnnotationInput['target'] = undefined;

	export let onSave:
		| (({ content }: { content: JSONContent }) => void)
		| undefined = undefined;
	export let onCancel: (({ content }: { content: JSONContent }) => void) | undefined = undefined;
	let className: string | null | undefined = undefined;
	export { className as class };

	const dispatch = createEventDispatcher();
	const queryClient = useQueryClient();
	const mutation = updateAnnotationMutation({
		onSuccess: () => {
			_save();
		},
	});
	// const mutation = createMutation({
	// 	mutationFn: (input: MutationInput<'save_note'>) =>
	// 		mutate('save_note', input),
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries({
	// 			queryKey: ['entries'],
	// 		});
	// 		queryClient.invalidateQueries({
	// 			queryKey: ['notes'],
	// 		});
	// 		dispatch('save', { content });
	// 	},
	// });

	function cancel() {
		dispatch('cancel');
		onCancel?.({ content });
	}

	function _save() {
		dispatch('save', { content });
		onSave?.({ content });
	}

	function save() {
		if (editor.isEmpty()) {
			toast('No content to save');
			return;
		}
		if (Array.isArray(entryId)) {
			mutate('bulkNoteInsert', {
				entryIds: entryId,
				contentData: content,
			})
				.catch((e) => {
					console.error(e);
					toast.error('Error saving note');
				})
				.then(() => {
					_save();
					invalidateEntries(queryClient);
					queryClient.invalidateQueries({
						queryKey: ['notes'],
					});
				});
		} else {
			$mutation.mutate({
				id: annotationId,
				entryId: entryId,
				contentData: content,
				media,
				type,
				target,
			});
		}
	}

	// function maximize() {
	// 	isDialogOpen = true;
	// 	dispatch('maximize');
	// }

	let content: JSONContent;
	let editor: Editor;

	let isDialogOpen = false;
</script>

<div
	class={cn(
		'border flex flex-col gap-2 relative rounded-md py-3 px-4 bg-card focus-within:shadow-md border-input shadow-sm transition',
		className,
	)}
>
	<!-- Header -->
	<!-- TODO -->
	{#if $$slots.header}
		<div class="flex justify-end">
			<slot name="header">
				<!-- <div class="flex absolute top-3 z-10 right-4">
		<Button on:click={maximize} size="icon" class="h-6 w-6" variant="ghost">
			<Maximize2 class="h-3 w-3" />
		</Button>
	</div> -->
			</slot>
		</div>
	{/if}

	<!-- store data in entryId -->
	<Editor
		bind:this={editor}
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
		<Button
			variant="secondary"
			size="sm"
			class="dark:border-stone-200"
			on:click={save}>Save</Button
		>
	</div>
</div>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content>
		<Editor />
	</Dialog.Content>
</Dialog.Root>
