<script lang="ts">
	import { page } from '$app/stores';
	import Editor from '$components/ui/editor/Editor.svelte';
	import { mutation } from '$lib/queries/query';
	import { draggable } from '@neodrag/svelte';
	import type { JSONContent } from '@tiptap/core';

	export let annotation_id: string | undefined = undefined;
	export let content: JSONContent | undefined = undefined;
</script>

<div class="shadow-2xl h-64 max-w-sm" use:draggable>
	<Editor id={annotation_id} {content} on:save class="shadow-none min-h-min h-64 overflow-y-auto" />
</div>
