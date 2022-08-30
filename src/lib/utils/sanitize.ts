import { parse } from 'node-html-parser';

export async function stripTags(html: string) {
	const parsed = parse(html);
	return parsed.textContent;
}

export async function stripEmptyTags(html: string) {
	const parsed = parse(html);
	// loop through all children and remove those with empty textcontent
	for (const child of parsed.childNodes) {
		if (child.textContent?.trim() === '') {
			child.remove();
		}
	}
	return parsed.innerHTML;
}
