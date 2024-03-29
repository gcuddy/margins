const regexes = [
	/(blog|website)\s+of\s+(.*)?$/,
	/([\w+]\s?[\w]+\s?[\w]+?)[’']s\s+(blog|website)/gim,
	/(?:blog|website) +by +(.*?)$/gim,
];

const selectors = ['title', '.author', '#site-info', '.site-info', '.byline'].join(',');

/**
 *
 * @param {import('node-html-parser').HTMLElement} root
 * This is a fallback function to get the author name from the page.
 * It should be called only after exhausting all other options, such as meta tags, JSON-LD, etc.
 */
export function findAuthor(root) {
	const els = root.querySelectorAll(selectors);
	for (const el of els) {
		const text = el.innerText;
		if (!text) return;
		for (const regex of regexes) {
			const match = regex.exec(text);
			if (match) {
				return match[1];
			}
		}
	}
}
