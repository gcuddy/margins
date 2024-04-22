import type { Annotation } from '@margins/features/core';
import type { TextQuoteSelector } from '../annotator/types.js';
import {
	createTextQuoteSelectorMatcher,
	highlightText,
} from '../annotator/index.js';

/**
 * Synchronize the highlights with the DOM.
 */
export async function syncHighlights(
	rootEl: HTMLElement,
	_annotations: Annotation.Item[],
) {
	if (!rootEl) {
		console.error('rootEl is not defined');
		return;
	}
	console.log('syncHighlights');
	const annotations = _annotations.filter(
		(a) => !!a.target,
	) as Annotation.Item[];
	console.log({ annotations });
	const existingIds = annotations.map((a) => a.id);
	console.log('existingIds', existingIds);

	const annotationsInDom = existingIds.length
		? Array.from(
				rootEl.querySelectorAll(
					existingIds
						.map((id) => `[data-margins-annotation-id="${id}"]`)
						.join(','),
				),
			)
		: [];
	// TODO: ^^ above might not scale well, consider caching lookups with a map, or something like this:
	// const annotationsInDom = existingIds.reduce((acc, id) => {
	//     const element = rootEl.querySelector(`[data-margins-annotation-id="${id}"]`);
	//     if (element) acc.push(element);
	//     return acc;
	//   }, []);

	console.log('annotationsInDom', annotationsInDom);

	// Remove annotations that are no longer in the list
	for (const annotationEl of annotationsInDom) {
		if (!(annotationEl instanceof HTMLElement)) continue;
		if (!existingIds.includes(annotationEl.dataset.marginsAnnotationId!)) {
			annotationEl.remove();
		}
	}

	// Add annotations that are not in the DOM
	const annotationsToAdd = annotations.filter(
		(a) =>
			!annotationsInDom.some(
				(el) =>
					el instanceof HTMLElement && el.dataset.marginsAnnotationId === a.id,
			),
	);

	console.log('annotationsToAdd', annotationsToAdd);

	for (const annotation of annotationsToAdd) {
		const selectors = Array.isArray(annotation.target!.selector)
			? annotation.target!.selector
			: [annotation.target!.selector];
		const TextQuoteSelector = selectors.find(
			(s) => s.type === 'TextQuoteSelector',
		) as TextQuoteSelector | undefined;
		console.log({ TextQuoteSelector });
		// TODO: other selectors
		if (!TextQuoteSelector) continue;
		await highlightSelectorTarget(TextQuoteSelector, rootEl, {
			'data-margins-annotation-id': annotation.id,
		});
	}
}

export async function highlightSelectorTarget(
	textQuoteSelector: TextQuoteSelector,
	rootEl: HTMLElement = document.body,
	attributes: Record<string, string> = {},
) {
	const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(rootEl);
	console.log({ matches });

	const matchList = [];
	for await (const match of matches) matchList.push(match);

	console.log({ matchList });

	for (const match of matchList) highlightText(match, 'mark', attributes);
}
