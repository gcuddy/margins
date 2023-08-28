import type { BeforeNavigate } from '@sveltejs/kit';
import { type Writable, writable } from 'svelte/store';

export const backContext = writable(`/tests/library/backlog`);

export function setBackContext(navigation: BeforeNavigate, path: string): void {
	if (navigation.to?.route.id?.endsWith(`[type=type]/[id]`)) {
		backContext.set(path);
	}
}

export type ArticleStore = {
	states: {
		progress: Writable<number>;
	};
};

export function createArticleStore(): ArticleStore {
	return {
		states: {
			progress: writable(0),
		},
	};
}
