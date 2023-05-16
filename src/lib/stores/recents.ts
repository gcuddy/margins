import type { EntryInList } from '$lib/db/selects';
import { localStorageStore } from '@skeletonlabs/skeleton';

// should make search a set but also make it serializable
interface Recents {
	search: string[];
	// store just a subset of article Type
	entries: EntryInList[];
}



function createRecentsStore() {
	const { subscribe, set, update } = localStorageStore<Recents>(
		"recents_store",
		{
			search: [],
			entries: [],
		}
	);
	function add_search(search: string) {
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
	function add_entry(entry: EntryInList) {
		update((recents) => {
			if (!entry.id) return recents;
			if (!recents.entries) {
				recents.entries = [];
			}
			const existing = recents.entries.find((a) => a.id === entry.id);
			if (!existing) {
				// destructure everything in case we got passed extra fields
				const { id, title, author, googleBooksId, image, podcastIndexId, published, spotifyId, tmdbId, type, uri, wordCount, progress, sort_order, } = entry;
				// add to top
				recents.entries.unshift({ id, title, author, googleBooksId, image, podcastIndexId, published, spotifyId, tmdbId, type, uri, wordCount, progress, sort_order, });
				if (recents.entries.length > 8) {
					// slice to 8
					recents.entries = recents.entries.slice(0, 8);
				}
			} else {
				// move to top
				recents.entries = recents.entries.filter((a) => a.id !== entry.id);
				recents.entries.unshift(existing);
			}
			return recents;
		});
	}

	return {
		subscribe,
		set,
		update,
		add_search,
		add_entry,
	};
}

export const recents = createRecentsStore();