<script lang="ts">
	import AnnotationCard from '$components/annotations/annotation-card.svelte';
	import SlimEntry from '$components/entries/slim-entry.svelte';
	import Header from '$components/ui/Header.svelte';
	import type { Note } from '$lib/queries/server';

	export let note: Note;
</script>

<div class="flex grow">
	<div
		class="flex flex-col gap-4 relative shrink-0 max-w-4xl mx-auto justify-stretch items-stretch w-full px-2 py-9"
	>
    {#if note.entry}
		<div class="flex items-center justify-center">
			<SlimEntry link entry={note.entry} />
		</div>
        {/if}
		<div class="flex">
			<AnnotationCard annotation={note} />
		</div>
	</div>
</div>
