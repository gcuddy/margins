<script lang="ts">
	import Breadcrumbs from '$components/breadcrumbs.svelte';
	// import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Note } from '$components/notes';
	import Header from '$components/ui/Header.svelte';
	import type { JSONContent } from '@tiptap/core';
	import type { Snapshot } from './$types.js';
	import { goto } from '$app/navigation';
	// import NoteSidebar from './NoteSidebar.svelte';
	export let data;

	let saved = false;

	let title = '';

	let contentData: JSONContent = {
		type: 'doc',
		content: [
			{
				type: 'paragraph',
			},
		],
	};

	export const snapshot: Snapshot = {
		capture: () => {
			if (saved) return;
			return {
				title,
				contentData,
			};
		},
		restore: (snapshot) => {
			title = snapshot.title;
			contentData = snapshot.contentData;
		},
	};
</script>

<Header>
	<div class="flex items-center gap-3">
		<Breadcrumbs
			root={{
				name: 'notes',
				href: '/notebook',
			}}
			path={[
				{
					name: title || 'New note',
				},
			]}
		/>
	</div>
</Header>
<Note on:save={(e) => {
    const { id } = e.detail;
    goto(`/note/${id}`);
    // navigate to note
}} autofocus />
