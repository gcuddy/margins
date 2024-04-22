<script lang="ts">
	import { AnnotatorWrapper } from '@margins/features/entries/annotation';
	import { derived } from 'svelte/store';
	import { useCreateNoteMutation } from '../data/mutations';
	import { createId } from '@margins/lib';
	import { useNotesQuery } from '../data/queries';

	export let entryID: string;

	const createNoteMutation = useCreateNoteMutation(entryID);
	const notesQuery = useNotesQuery(entryID);

	const annotations = derived(notesQuery, ($notes) => {
		return $notes.data?.filter((note) => note.type === 'annotation') ?? [];
	});
</script>

<AnnotatorWrapper
	annotations={$annotations}
	onHighlight={(textQuote) => {
		$createNoteMutation.mutate({
			entryId: entryID,
			id: createId(),
			target: {
				selector: textQuote,
			},
			type: 'annotation',
		});
	}}
/>
