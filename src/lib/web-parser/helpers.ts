import type { HTMLElement } from 'node-html-parser';

export const not = (el: HTMLElement | HTMLElement[], selector: string) => {
	if (Array.isArray(el)) {
		// filter using tagName
		return el.filter((e) => e.tagName.toUpperCase() !== selector.toUpperCase());
	} else {
		return el.querySelectorAll(`:not(${selector})`);
	}
};
