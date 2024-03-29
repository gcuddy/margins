import { parse } from 'node-html-parser';

export function stripTags(html: string) {
	const parsed = parse(html);
	return parsed.textContent;
}

export function stripEmptyTags(html: string) {
	if (!html) return '';
	const parsed = parse(html);
	parsed.querySelectorAll('*:not(hr)').forEach((node) => {
		if (!node.textContent.trim()) {
			node.remove();
		}
	});
	// loop through all children and remove those with empty textcontent
	// for (const child of parsed.childNodes) {
	//     // if child has no text content, remove it
	//     // unless it's a hr
	// 	if (child.textContent?.trim() === '') {
	// 		child.remove();
	// 	}
	// }
	return parsed.innerHTML;
}
