import { browser } from '$app/environment';
import { writable } from 'svelte/store';

let stored_lastRefresh: number | undefined;

if (browser) {
	const stored = localStorage.getItem('lastFeedRefresh');
	if (stored) {
		stored_lastRefresh = JSON.parse(stored);
	}
}

export const lastFeedRefresh = writable<number>(stored_lastRefresh || 0);

if (browser) {
	lastFeedRefresh.subscribe((value) => (localStorage.lastFeedRefresh = JSON.stringify(value)));
}
