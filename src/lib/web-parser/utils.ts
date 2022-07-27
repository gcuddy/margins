import { HTMLElement, parse } from 'node-html-parser';
import { URL } from 'url';
export function absolutizeUrls(root: HTMLElement, baseUrl: string, attr: string) {
	const nodes = root.querySelectorAll(`[${attr}]:not([class*='footnote'])`);
	for (const node of nodes) {
		const url = node.getAttribute(attr);
		if (!url) continue;
		const absUrl = new URL(url, baseUrl).href;
		node.setAttribute(attr, absUrl);
	}
	return root;
}

export function absolutizeSet(root: HTMLElement, baseUrl: string) {
	const nodes = root.querySelectorAll('[srcset]');
	for (const node of nodes) {
		const srcset = node.getAttribute('srcset');
		if (!srcset) continue;
		// a comma should be considered part of the candidate URL unless preceded by a descriptor
		// descriptors can only contain positive numbers followed immediately by either 'w' or 'x'
		// space characters inside the URL should be encoded (%20 or +)
		const candidates = srcset.match(/(?:\s*)(\S+(?:\s*[\d.]+[wx])?)(?:\s*,\s*)?/g);
		if (!candidates) continue;
		const absCandidates = candidates.map((candidate) => {
			// a candidate URL cannot start or end with a comma
			// descriptors are separated from the URLs by unescaped whitespace
			const parts = candidate.trim().replace(/,$/, '').split(/\s+/);
			parts[0] = new URL(parts[0], baseUrl).href;
			return parts.join(' ');
		});
		const absSrcset = [...new Set(absCandidates)].join(', ');
		node.setAttribute('srcset', absSrcset);
	}
	return root;
}

export function changeElementTag(element: HTMLElement, tagName: string): HTMLElement {
	return parse(`<${tagName}>${element.innerHTML}</${tagName}>`);
}

export function findMeta(metaEls: HTMLElement[], name: string) {
	const meta = metaEls.find(
		(el) => el.getAttribute('name') === name || el.getAttribute('property') === name
	);
	if (meta) return meta.getAttribute('content');
}

// Given a a list of selectors find content that may
// be extractable from the document. This is for flat
// meta-information, like author, title, date published, etc.
// Credit to @postlight/mercury-parser
export function extractFromSelectors(
	root: HTMLElement,
	selectors: string[],
	maxChildren = 1,
	textOnly = true
) {
	for (const selector of selectors) {
		const elements = root.querySelectorAll(selector);
		if (elements.length !== 1) continue;
		const element = elements[0];
		if (element.childNodes.length > maxChildren) continue;
		if (textOnly) {
			const text = element.text;
			if (text) return text;
		} else {
			return element.innerHTML;
		}
	}
}

const NORMALIZE_RE = /\s{2,}(?![^<>]*<\/(pre|code|textarea)>)/g;

export function normalizeSpaces(text: string) {
	return text.replace(NORMALIZE_RE, ' ').trim();
}

export function scoreCommas(text: string) {
	return (text.match(/,/g) || []).length;
}

export function printRawHTMLTag(element: HTMLElement) {
	return `${element.rawTagName} ${element.rawAttrs}`;
}
