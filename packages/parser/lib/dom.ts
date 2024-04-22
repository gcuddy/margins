import type { HTMLElement } from '../dom-parser.js';

export function extractFromMeta(
	el: HTMLElement,
	metaTags: Array<string | [string, string]>,
) {
	for (const name of metaTags) {
		// NOTE: review if this is best practice; we check both name and property for simplicity, but could also modify input type to specify
		const types = ['name', 'property'];
		const value = 'content';
		const node =
			el.querySelector(`meta[${types[0]}="${name}"]`) ??
			el.querySelector(`meta[${types[1]}="${name}"]`);
		const text = node?.getAttribute(value);
		if (text) return text;
	}
}
