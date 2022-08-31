import { get, readable, writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Podcast } from '$lib/types/schemas/Podcast';
export const podcasts = writable<Podcast[]>([]);
function arrayToDict(arr) {
	const dict = {};
	arr.forEach((value) => {
		dict[value.id] = value;
	});
	return dict;
}

export async function fetchBooksStore(fetch) {
	const _podcasts = browser && get(podcasts);
	if (_podcasts && _podcasts.length > 0) {
		return podcasts;
	}
	// const response = await fetch('/books.json');
	// const fetchedBooks = await response.json();
	// if (browser) {
	// 	booksStore.set(arrayToDict(fetchedBooks));
	// 	return booksStore;
	// } else {
	// 	return readable(arrayToDict(fetchedBooks));
	// }
}
