<script lang="ts">
	import type { Editor, NodeViewProps } from '@tiptap/core';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import PromptInput from '$components/ui/srs-card/PromptInput.svelte';
	import { cn } from '$lib/utils/tailwind';
	import { getContext } from 'svelte';
	import { currentAnnotation } from '../../../../../../routes/tests/(app2)/(listables)/[type=type]/[id]/Article.svelte';

	export let node: NodeViewProps['node'];
	export let updateAttributes: NodeViewProps['updateAttributes'];
	export let selected: NodeViewProps['selected'] = false;
	export let editor: Editor;

	$: editable = editor.isEditable && selected;
	$: console.log({ editor });
	$: console.log({ $$props });

	const context = getContext('editor_context');
	console.log({ context });

	let prompt = node.attrs.prompt;
	let response = node.attrs.response;
	let id = node.attrs.id;
	let active = false;
	$: if (selected) {
		active = true;
	}

	$: if (prompt !== node.attrs.prompt || response !== node.attrs.response || id !== node.attrs.id) {
		updateAttributes({
			prompt,
			response,
			id
		});

		// and submit form...
		console.log(`TODO: submit form with ${prompt} and ${response} and ${id}`);
	}
</script>

<!-- TODO: don't show input when not seloected (just show Prompt) -->
<!-- TODO: hide Save button, auto-save on blur -->
<!-- TODO: on delete, show alert warning of delete - see https://github.com/ueberdosis/tiptap/issues/3700 or https://github.com/ueberdosis/tiptap/issues/181 -->

<NodeViewWrapper
	id="svelte-component"
	contenteditable="false"
	class={cn('px-4 pb-4 my-4 border-l-2 border-primary border-2 flex flex-col max-w-prose', editable && 'ring')}
>
	<!-- TODO: Render Markdown with Latex -->
	<!-- <MarkdownBox placeholder="Enter prompt here" />
<MarkdownBox placeholder="Enter response here" as="textarea" rows={1} /> -->
	<PromptInput
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
	/>
</NodeViewWrapper>
