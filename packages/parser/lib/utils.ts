import type { Document, HTMLElement } from '../dom-parser.js';

export function getFirstMatchingElement(
	doc: Document,
	...selectors: string[]
): HTMLElement | null {
	for (const selector of selectors) {
		const el = doc.querySelector(selector);
		if (el) return el;
	}
	return null;
}
