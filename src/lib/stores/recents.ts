import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { Article } from '@prisma/client';

// should make search a set but also make it serializable
interface Recents {
	search: string[];
	// store just a subset of article Type
	articles: Pick<
		Article,
		'id' | 'title' | 'date' | 'updatedAt' | 'url' | 'readProgress' | 'author'
	>[];
}

let storedRecents: Recents | undefined;

if (browser) {
	const stored = localStorage.getItem('recents');
	if (stored) {
		storedRecents = JSON.parse(stored);
	}
}

function createRecentsStore() {
	const { subscribe, set, update } = writable<Recents>(
		storedRecents || {
			search: [],
			articles: []
		}
	);

	if (browser) {
		subscribe((value) => (localStorage.recents = JSON.stringify(value)));
	}

	function addRecentSearch(search: string) {
		update((recents) => {
			if (!search.trim()) return recents;
			if (recents.search.indexOf(search) === -1) {
				// recents.search.push(search);
				// add to top
				recents.search.unshift(search);
				if (recents.search.length > 8) {
					// recents.search.pop();
					// slice to 8
					recents.search = recents.search.slice(0, 8);
				}
			}
			return recents;
		});
	}
	function addRecentArticle({ id, title, date, updatedAt, url, readProgress, author }: Article) {
		update((recents) => {
			if (!id) return recents;
			if (!recents.articles) {
				recents.articles = [];
			}
			if (!recents.articles.find((a) => a.id === id)) {
				// recents.search.push(search);
				// add to top
				recents.articles.unshift({
					id,
					title,
					date,
					updatedAt,
					url,
					readProgress,
					author
				});
				if (recents.articles.length > 8) {
					// recents.articleIds.pop();
					// slice to 8
					recents.articles = recents.articles.slice(0, 8);
				}
			}
			return recents;
		});
	}

	return {
		subscribe,
		set,
		update,
		addRecentSearch,
		addRecentArticle
	};
}

export const recents = createRecentsStore();

// export const recents = writable<Recents>(
// 	storedRecents || {
// 		search: []
// 	}
// );

// if (browser) {
// 	recents.subscribe((value) => (localStorage.recents = JSON.stringify(value)));
// }
