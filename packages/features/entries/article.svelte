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
	<div class="prose dark:prose-invert prose-gold mx-auto my-9">
		<h1 class="text-2xl font-bold leading-none">
			{bookmark.title ?? bookmark.entry?.title ?? '[no title]'}
		</h1>
		<AnnotatorWrapper
			rootEl="contain"
			{annotations}
			onHighlight={handleHighlight}
		>
			<div
				class="prose dark:prose-invert prose-gold prose-a:text-golda-11 dark:prose-a:text-golddarka-11 prose-a:no-underline hover:prose-a:underline prose-a:decoration-[min(2px,max(1px,.05em))] prose-a:underline-offset-[calc(.025em+2px)] prose-a:decoration-sanda-5 dark:prose-a:decoration-sanddarka-5 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:border-golda-6 dark:prose-blockquote:boder-golddarka-6 font-crimson"
			>
				{@html bookmark.entry?.html ?? '[no content]'}
			</div>
		</AnnotatorWrapper>
	</div>
</div>

<style>
	/* .prose-gold {
		--tw-prose-body: theme(colors.sand.12);
	} */
	.prose
		:where(blockquote):not(
			:where([class~='not-prose'], [class~='not-prose'] *)
		) {
	}
	.prose-gold {
		font-size: clamp(17px, 2vw, 19px);
		line-height: clamp(1.4em, calc(50px - 1vw), 1.5em);
		--tw-prose-body: theme(colors.sand.12);
	}
</style>
