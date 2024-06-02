<script lang="ts">
	import { createId } from '@margins/lib';
	import type { Annotation } from '../core/index.js';

	// TODO: really we just need an entry here, not a bookmark
	import type { BookmarkWithEntry } from '../data/index.js';
	import { getReplicache } from '../replicache/client.js';
	import { AnnotatorWrapper } from './annotation/index.js';
	import type { TextQuoteSelector } from '@margins/annotator';
	import { HoverCard } from '@margins/ui';
	import { onMount } from 'svelte';
	import { createFloatingActions } from 'svelte-floating-ui';
	import { hoverCardContent } from '../../ui/components/hover-card/index.js';

	export let bookmark: BookmarkWithEntry;
	export let annotations: Annotation.Item[];

	const rep = getReplicache();

	const [ref, content] = createFloatingActions();

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

	let isHoverCardOpen = false;
	let hoverCardEl: HTMLElement | undefined;
	$: console.log({ isHoverCardOpen });

	function hoverCardListener(el: HTMLElement) {
		const listener = (event: MouseEvent) => {
			if (event.target && event.target instanceof HTMLAnchorElement) {
				isHoverCardOpen = true;
				hoverCardEl = event.target;
				ref(event.target);
				console.log('Hovered over a link:', event.target.href);

				// You can perform additional actions here
			}
		};

		const mouseout = (event: MouseEvent) => {
			isHoverCardOpen = false;
		};

		el.addEventListener('mouseover', listener);
		el.addEventListener('mouseout', mouseout);

		return {
			destroy() {
				el.removeEventListener('mouseover', listener);
				el.removeEventListener('mouseout', mouseout);
			},
		};
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
				use:hoverCardListener
				class="prose dark:prose-invert prose-gold prose-a:text-golda-11 dark:prose-a:text-golddarka-11 prose-a:no-underline hover:prose-a:underline prose-a:decoration-[min(2px,max(1px,.05em))] prose-a:underline-offset-[calc(.025em+2px)] prose-a:decoration-sanda-5 dark:prose-a:decoration-sanddarka-5 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:border-golda-6 dark:prose-blockquote:boder-golddarka-6 font-crimson"
			>
				{@html bookmark.entry?.html ?? '[no content]'}
				<!-- TODO: a11y for hover card (need our own custom implementation) -->
				{#if isHoverCardOpen}
					<div use:content class={hoverCardContent({})}>testing testing</div>
				{/if}
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
