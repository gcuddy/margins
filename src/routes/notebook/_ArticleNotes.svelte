<!-- TODO: combine highlights and annotations so that they're next to each other/connected -->
<script lang="ts">
	import type { Annotation, Highlight } from '@prisma/client';
	import Note from './_Note.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';
	export let article: ArticleWithNotesAndTagsAndContext;
	$: notes = [...article.highlights, ...article.annotations];
	const handleDnd = (e: CustomEvent<DndEvent>) => {
		notes = <(Highlight | Annotation)[]>e.detail.items;
		dragDisabled = true;
	};
	let dragDisabled = true;
</script>

{#if notes}
	<div
		class="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3"
		use:dndzone={{
			items: notes,
			flipDurationMs: 300,
			type: article.id.toString(),
			dragDisabled,
			dropTargetStyle: {}
		}}
		on:consider={handleDnd}
		on:finalize={handleDnd}
	>
		{#each notes as note (note.id)}
			<div animate:flip={{ duration: 300 }}>
				<Note
					bind:dragDisabled
					articleUrl={article.url}
					bind:note
					on:delete={() => notes.filter((n) => n.id !== note.id)}
				/>
			</div>
		{/each}
	</div>
{/if}
