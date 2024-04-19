import type { HTMLElement } from 'node-html-parser';

export function getFirstMatchingElement(
	doc: HTMLElement,
	...selectors: string[]
): HTMLElement | null {
	for (const selector of selectors) {
		const el = doc.querySelector(selector);
		if (el) return el;
	}
	return null;
}
