<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/ui/Button.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import { mutation } from '$lib/queries/query';
	import { draggable } from '@neodrag/svelte';
	import type { JSONContent } from '@tiptap/core';

	export let annotation_id: string | undefined = undefined;
	export let content: JSONContent | undefined = undefined;
</script>

<div class="shadow-2xl border rounded-lg p-4 max-w-sm w-80 bg-popover" use:draggable>
	<Editor
		id={annotation_id}
		{content}
		on:save
		class="shadow-none overflow-y-auto sm:mb-0 p-0 pb-8  sm:px-0 sm:border-none"
        extensions={{
            placeholder: "Type note here..."
        }}
	/>
	<Button class="">Save</Button>
</div>
