<script lang="ts">
	import { createId } from '@margins/lib';
	import type { Annotation } from '../core/index.js';

	// TODO: really we just need an entry here, not a bookmark
	import type { BookmarkWithEntry } from '../data/index.js';
	import { getReplicache } from '../replicache/client.js';
	import { AnnotatorWrapper } from './annotation/index.js';
	import type { TextQuoteSelector } from '@margins/annotator';
	export let bookmark: BookmarkWithEntry;
	export let annotations: Annotation.Item[];

	const rep = getReplicache();

	function handleHighlight(textQuote: TextQuoteSelector) {
		rep.mutate.annotation_create({
			entryId: bookmark.entry.id,
			id: createId(),
			target: {
				selector: textQuote,
			},
			type: 'annotation',
		});
	}
</script>

<div class="grow overflow-auto">
	<div class="prose dark:prose-invert prose-stone mx-auto my-9">
		<h1 class="font-serif text-4xl font-semibold tracking-tight">
			{bookmark.title ?? bookmark.entry?.title ?? '[no title]'}
		</h1>
		<AnnotatorWrapper
			rootEl="contain"
			{annotations}
			onHighlight={handleHighlight}
		>
			<div class="prose dark:prose-invert prose-stone">
				{@html bookmark.entry?.html ?? '[no content]'}
			</div>
		</AnnotatorWrapper>
	</div>
</div>
