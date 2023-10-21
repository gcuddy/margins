import { getGbookImage } from '$lib/features/books/utils';
import { redis } from '$lib/redis';
import type { Book } from './gbook';

export async function itunesCoverLookup(isbn: string) {
	const response = await fetch(`https://itunes.apple.com/lookup?isbn=${isbn}`);
	if (!response.ok) {
		return null;
	}

	const data = (await response.json()) as any;

	if (!data.results?.[0]) {
		return null;
	}

	const artwork = data.results[0].artworkUrl100;

	// replace 100 with 600
	return artwork.replace('100x100', '600x600') as string;
}

export async function openLibraryCoverLookup(isbn: string) {
	// TODO: rate limit
	const response = await fetch(
		`http://covers.openlibrary.org/b/isbn/${isbn}-L.json`,
	);
	// we want to be redirected to url
	if (!response.ok || !response.redirected) {
		return null;
	}
	return response.url;
}

export async function findHighestQualityBookCover(book: Book) {
	// start with google book, cross compare with itunes and openlibrary

	const { volumeInfo } = book;
	if (!volumeInfo) {
		return '';
	}
	const gbook_image = getGbookImage(book);
	// get isbn
	const isbn = volumeInfo.industryIdentifiers?.find((i) => i.type === 'ISBN_13')
		?.identifier;

	if (!isbn) {
		return gbook_image;
	}

	const cached = await redis.get(`bookcover:${isbn}`);
	if (cached) {
		console.log(`Found cached book cover`);
		return cached as string;
	}

	console.log({ gbook_image });

	const [itunes, openlibrary] = await Promise.all([
		itunesCoverLookup(isbn),
		openLibraryCoverLookup(isbn),
	]);

	const cover = itunes || openlibrary || gbook_image || '';

	await redis.set(`bookcover:${isbn}`, cover, {
		ex: 60 * 60 * 24 * 7,
	});

	return cover;
}
