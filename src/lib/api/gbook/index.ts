import type { books_v1 } from '@googleapis/books';

import { dev } from '$app/environment';
import { GOOGLE_BOOKS_API_KEY } from '$env/static/private';
import { redis } from '$lib/redis';

export * from "./utils";

const googleBooksApi = 'https://www.googleapis.com/books/v1/volumes';

export type Book = books_v1.Schema$Volume & {
	volumeInfo: NonNullable<books_v1.Schema$Volume['volumeInfo']>;
};

function assertIsBook(book: books_v1.Schema$Volume): asserts book is Book {
	if (!book.volumeInfo) throw new Error('Invalid book');
}

const time = (msg: string) => { dev && console.time(`[gbook] ${msg}`); };
const timeEnd = (msg: string) => { dev && console.timeEnd(`[gbook] ${msg}`); };

export const books = {
	get: async (volumeId: string) => {
		time('get book');
		const cached = await redis.get(`gbook:${volumeId}`);
		if (cached) {
			console.log('cached', cached);
			timeEnd('get book');
			return cached as Book;
		}
		const response = await fetch(`${googleBooksApi}/${volumeId}?key=${GOOGLE_BOOKS_API_KEY}`);
        console.log({response})
		if (!response.ok) throw new Error(response.statusText);
		const data = (await response.json()) as books_v1.Schema$Volume;
		assertIsBook(data);
		await redis.set(`gbook:${volumeId}`, data, { ex: 60 * 60 * 24 * 7 });
        // TODO: Update Entry in MySQL / qstash to send to mysql
		timeEnd('get book');
		return data;
	},
	search: async (q: string, cache = true) => {
		time('search books');
		if (cache) {
			const cached = await redis.get(`gbook:search:${q}`);
			if (cached) {
				console.log('cached', cached);
				timeEnd('search books');
				return cached as books_v1.Schema$Volumes;
			}
		}
		const url = new URL(googleBooksApi);
		url.searchParams.set('q', q);
		url.searchParams.set('key', GOOGLE_BOOKS_API_KEY);
		const response = await fetch(url.toString(), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (!response.ok) throw new Error(response.statusText);
		const results = (await response.json()) as books_v1.Schema$Volumes;
		console.log({ url: url.toString() });
		console.log({ results });
		// REVIEW: filter out ebooks when the title and author are duplicated
		// results.items = results.items?.filter((book) => {
		// 	assertIsBook(book);
		// 	const { title, authors } = book.volumeInfo;
		// 	const titleAndAuthor = `${title ?? ''} ${authors?.join(' ') ?? ''}`;
		// 	return !results.items?.some((b) => {
		// 		assertIsBook(b);
		// 		const { title: t, authors: a } = b.volumeInfo;
		// 		const titleAndAuthor2 = `${t ?? ''} ${a?.join(' ') ?? ''}`;
		// 		return titleAndAuthor === titleAndAuthor2 && b.saleInfo?.isEbook;
		// 	});
		// });

		if (cache) {
			await redis.set(`gbook:search:${q}`, results, { ex: 60 * 60 * 24 * 7 });
		}

		return results;
	}
};
