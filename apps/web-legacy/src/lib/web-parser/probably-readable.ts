import type { HTMLElement } from 'node-html-parser';

export default function (root: HTMLElement) {
	let nodes = root.querySelectorAll('p, pre, article');
	const brNodes = root.querySelectorAll('div > br');
	if (brNodes.length) {
		const set = new Set(nodes);
		brNodes.forEach((node) => set.add(node.parentNode));
		nodes = Array.from(set);
	}
	let score = 0;
}
