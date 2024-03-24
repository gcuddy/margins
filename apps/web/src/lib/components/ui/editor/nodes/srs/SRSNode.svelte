<script lang="ts">
	import type { Editor, NodeViewProps } from '@tiptap/core';
	import { getContext, onMount } from 'svelte';
	import { NodeViewWrapper } from 'svelte-tiptap';

	import { notes } from '$lib/state/annotations';
	import { cn } from '$lib/utils/tailwind';

	import TEditor from '../../Editor.svelte';

	export let node: NodeViewProps['node'];
	export let updateAttributes: NodeViewProps['updateAttributes'];
	export let selected: NodeViewProps['selected'] = false;
	export let editor: Editor;

	$: editable = editor.isEditable && selected;

	const context = getContext('editor_context');

	let prompt = node.attrs.prompt;
	let response = node.attrs.response;
	const id = node.attrs.id;
	let active = false;
	$: if (selected) {
		active = true;
	}

	$: if (prompt !== node.attrs.prompt || response !== node.attrs.response || id !== node.attrs.id) {
		updateAttributes({
			id,
			prompt,
			response
		});

		if (id) {
			console.log('updating item');
			notes.update_item(id, { body: prompt, response });
		}

		// and submit form...
		console.log(`TODO: submit form with ${prompt} and ${response} and ${id}`);
	}

	onMount(() => {
		if (id) {
			// see if we have any deets from state
			const note = $notes[id];
			console.log({ note });
			if (note) {
				prompt = note.body;
				response = note.response;
			}
		}
	});
</script>

<!-- TODO: don't show input when not seloected (just show Prompt) -->
<!-- TODO: hide Save button, auto-save on blur -->
<!-- TODO: on delete, show alert warning of delete - see https://github.com/ueberdosis/tiptap/issues/3700 or https://github.com/ueberdosis/tiptap/issues/181 -->

<NodeViewWrapper
	id="svelte-component"
	contenteditable="false"
	class={cn(
		'px-4 pb-4 my-4 border-l-2 border-primary border-2 flex flex-col max-w-prose',
		editable && 'ring'
	)}
>
	<!-- TODO: Render Markdown with Latex -->
	<!-- <MarkdownBox placeholder="Enter prompt here" />
<MarkdownBox placeholder="Enter response here" as="textarea" rows={1} /> -->
	{prompt}

	{response}
	<!-- <PromptInput
		on:keydown={(e) => {
			console.log('keydown', e);
		}}
		on:blur={(e) => {
			console.log(`blur`, e);
		}}
		{active}
		parent_id={$currentAnnotation.annotation?.id}
		bind:id
		bind:prompt
		bind:response
		entry_id={node.attrs.entry_id}
		editable={editor.isEditable || selected}
		showButton={false}
	/> -->

	<TEditor blank />
</NodeViewWrapper>
