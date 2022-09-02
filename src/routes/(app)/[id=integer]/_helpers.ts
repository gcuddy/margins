import type { ArticleWithNotesAndTagsAndContext } from '$lib/types';
import { post } from '$lib/utils';
import type { Annotation } from '@prisma/client';

export async function postHighlight(articleId: number, body: HighlightBody) {
	return post(`/${articleId}/highlights.json`, body);
}
export async function postAnnotation(articleId: number, body: Partial<Annotation>) {
	console.log('posting annotation');
	return post(`/${articleId}/annotations`, body);
}

//  Pulled from web-highlighter code

const ROOT_IDX = -2;

export interface DomNode {
	$node: Node;
	offset: number;
}

export const getHighlightById = ($root: HTMLElement, id: string): HTMLElement[] => {
	return Array.from($root.querySelectorAll<HTMLElement>(`[data-highlight-id="${id}"]`));
};

export function setUpLinkDragHandlers(
	links: HTMLAnchorElement[],
	{ id, url }: { id?: number; url?: string }
) {
	links.forEach((link) => {
		link.addEventListener('dragstart', (e) => {
			// todo: add proper context, maybe with indexing where it is on page
			// at the very least, we'll give a context url
			if (url) e.dataTransfer?.setData('context-url', url);
			if (id) e.dataTransfer?.setData('context-id', id.toString());
		});
	});
}
