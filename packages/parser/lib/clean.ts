import type { HTMLElement } from '../dom-parser.js';

export function cleanBySelectors(el: HTMLElement, selectors?: string[]) {
	if (!selectors) return el;
	const selector = selectors.join(', ');
	const els = el.querySelectorAll(selector);
	els.forEach((el) => el.remove());
	return el;
}
