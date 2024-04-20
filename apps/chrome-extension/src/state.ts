import type { RssSource } from '@margins/rss/finder';
import { writable } from 'svelte/store';

type State = {
	feeds?: RssSource[];
	page: string | null;
};

function extension_state() {
	const store = writable<State>({
		page: null,
	});

	return store;
}

export const state = extension_state();
