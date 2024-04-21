<script lang="ts">
	import { Card } from '@margins/ui';
	import type { Annotation } from '../data/annotation.js';
	import type { TextQuoteSelector } from '@margins/annotator';
	import { ago } from '@margins/lib';

	export let annotation: Annotation;
	// TODO: user

	$: body = annotation.body;

	function getTextQuote(annotation: Annotation) {
		if (annotation.target) {
			const selectors = Array.isArray(annotation.target.selector)
				? annotation.target.selector
				: [annotation.target.selector];
			const selector = selectors.find((s) => s.type === 'TextQuoteSelector') as
				| TextQuoteSelector
				| undefined;
			if (selector) {
				return selector.exact;
			}
		}
		return null;
	}

	$: textQuote = getTextQuote(annotation);
</script>

<Card.Root class="text-xs">
	<Card.Header>
		{ago(new Date(annotation.createdAt), new Date())}
	</Card.Header>
	<Card.Content class="text-sm">
		{#if textQuote}
			<blockquote>{textQuote}</blockquote>
		{/if}
		{#if body}
			<p>
				{body}
			</p>
		{/if}
	</Card.Content>
	<Card.Footer>tags</Card.Footer>
</Card.Root>
