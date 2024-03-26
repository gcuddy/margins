import type { Article } from '@prisma/client';
import { derived, writable, type Readable } from 'svelte/store';

type LayoutMode = 'read' | 'annotate';
export const layoutMode = writable<LayoutMode>('read');
// this should be stored in user prefs
export const layoutVars = derived(layoutMode, ($layoutMode) => {
	switch ($layoutMode) {
		case 'read': {
			return '--grid-template: 1fr min(65ch, 100%) 1fr;';
		}
		case 'annotate': {
			return '--grid-template: min(65ch, 100%) 1fr; --grid-gap: 32px;';
		}
	}
});

export const currentArticle = writable<Article>(null);

export const highlightElements = writable<HTMLElement[]>([]);

interface HighlightPos {
	top: number;
	id: string;
	el: HTMLElement;
}

const getTopOfEl = (el: HTMLElement) => el.getBoundingClientRect().top;
export const uniqueHighlightElements = derived(highlightElements, ($highlightElements) => {
	const uniqueIds = [...new Set($highlightElements.map((h) => h.dataset.highlightId))];
	return uniqueIds.map((id) => {
		console.log({ id });
		const el = $highlightElements.find((h) => h.dataset.highlightId == id);
		return {
			top: el.offsetTop,
			el,
			id
		};
	});
	// TODO: respond to window resizing
	// window.addEventListener("resize", )
	// return $highlightElements.filter((h) => uniqueIds.includes(h.dataset.highlightId));
});

export const currentArticleForContextWhileDragging = writable<Readable<Article>>(null);
