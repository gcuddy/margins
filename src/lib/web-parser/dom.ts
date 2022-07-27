import type { HTMLElement } from 'node-html-parser';
import { CANDIDATES_BLACKLIST, CANDIDATES_WHITELIST, WHITELIST_ATTRS_RE } from './constants';
import { not } from './helpers';

export function stripUnlikelyCandidates(root: HTMLElement) {
	const els = not(root, 'a');
	els.forEach((el, index) => {
		const { classNames, id } = el;
		const classAndId = `${classNames} ${id}`;
		if (CANDIDATES_WHITELIST.test(classAndId)) {
			return;
		}
		if (CANDIDATES_BLACKLIST.test(classAndId)) {
			// els.splice(index, 1);
			el.remove();
		}
	});
	return root;
}

// Loop through the provided doc, and convert any p-like elements to
// actual paragraph tags.
//
//   Things fitting this criteria:
//   * Multiple consecutive <br /> tags.
//   * <div /> tags without block level elements inside of them
//   * <span /> tags who are not children of <p /> or <div /> tags.
//

export function convertToParagraphs(els: HTMLElement[]) {
	// els.filter(el => el.tagName === "BR").forEach((el, index) => {
	//   const next = el.nextSibling;
	// })
	// brsToPs
	// els = convertDivs(els);
	// els = convertSpans(els);
	// return $;
}

export function cleanAttributes(root: HTMLElement) {
	const node = root.parentNode?.childNodes?.length ? root.parentNode : root;

	node.querySelectorAll('*').forEach((el) => {
		const { attributes } = el;
		if (attributes) {
			Object.keys(attributes).forEach((key) => {
				if (!WHITELIST_ATTRS_RE.test(key)) {
					console.log(`Removing attribute ${key}`);
					el.removeAttribute(key);
				}
			});
		}
	});
	return node;
}
