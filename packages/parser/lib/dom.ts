import type { HTMLElement, Parser } from '../dom-parser.js';
import { CANDIDATES_BLACKLIST, CANDIDATES_WHITELIST } from './constants.js';

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

/** Loop through the provided document and remove any non-link nodes
  that are unlikely candidates for article content.
 */
export function stripUnikelyCandidates(el: HTMLElement): HTMLElement {
	// NOTE: think about whether we want to make a structured clone or we want to mutate
	//
	const $els = el.querySelectorAll('*');
	if ('entries' in $els) {
		// todo
	}

	const l = Array.from($els);
	const els = Array.from(el.querySelectorAll('*'));

	for (const el of els) {
		if (el.tagName.toLowerCase() === 'a') continue;

		const classes = el.getAttribute('class');
		const id = el.getAttribute('id');

		if (!classes && !id) continue;

		const classAndId = `${classes || ''} ${id || ''}`;
		if (CANDIDATES_WHITELIST.test(classAndId)) {
			continue;
		}
		if (CANDIDATES_BLACKLIST.test(classAndId)) {
			el.remove();
		}
	}

	return el;
}

/**
 *
 * Given a node, turn it into a P if it is not already a P, and
 * make sure it conforms to the constraints of a P tag (I.E. does
 * not contain any other block tags.)
 */
export default function paragraphize(
	parser: Parser,
	node: HTMLElement,
	root: HTMLElement,
	br = false,
) {
	if (br) {
		let sibling = node.nextElementSibling;
		const p = parser.parse('<p></p>').querySelector('p')!;

		// while the next node is text or not a block level element
		// append it to a new p node
		while (
			sibling &&
			!(sibling.tagName && BLOCK_LEVEL_TAGS_RE.test(sibling.tagName))
		) {
			const { nextElementSibling } = sibling;
			p.appendChild(sibling);
			sibling = nextElementSibling;
		}

		node.replaceWith(p);
		node.remove();
		return node;
	}

	return node;
}
