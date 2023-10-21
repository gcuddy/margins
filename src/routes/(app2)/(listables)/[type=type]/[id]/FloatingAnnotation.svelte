<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import type { JSONContent } from '@tiptap/core';
	import { scale } from 'svelte/transition';

	import { page } from '$app/stores';
	import { Button }  from '$components/ui/button';
	import Editor from '$components/ui/editor/Editor.svelte';
	import { mutation } from '$lib/queries/query';

	export let annotation_id: string | undefined = undefined;
	export let content: JSONContent | undefined = undefined;

	let editor: Editor;
</script>

<div
	transition:scale
	class="shadow-2xl border rounded-lg p-4 max-w-sm w-80 bg-popover"
	use:draggable
>
	<Editor
		bind:this={editor}
		id={annotation_id}
		{content}
		on:save
		class="shadow-none overflow-y-auto sm:mb-0 p-0 pb-8  sm:px-0 sm:border-none"
		extensions={{
			placeholder: 'Type note here...'
		}}
	/>
	<Button
		on:click={() => {
			editor.save((contentData) => {
				// TODO here
				// if (!data.entry?.id) return;
				// console.log({ $currentAnnotation });
				// const id = $currentAnnotation.annotation?.id ?? nanoid();

				// $currentAnnotation.show = false;
				// if (!$currentAnnotation.highlight) return;
				// toast.promise(
				// 	mutation($page, 'save_note', {
				// 		entryId: data.entry.id,
				// 		id,
				// 		contentData,
				// 		type: 'annotation',
				// 		target: {
				// 			source: '',
				// 			selector: $currentAnnotation.highlight?.selector
				// 		}
				// 	}),
				// 	{
				// 		loading: 'Saving note...',
				// 		success: 'Note saved!',
				// 		error: 'Failed to save note'
				// 	}
				// );
			});
		}}
	>
		Save
	</Button>
</div>
