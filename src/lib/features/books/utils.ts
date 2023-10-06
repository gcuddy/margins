import {
	BookIcon,
	BotIcon,
	BrainIcon,
	FilmIcon,
	LightbulbIcon,
	SpeechIcon,
	SwordIcon,
	Users2Icon,
} from 'lucide-svelte';

import type { Book } from '$lib/api/gbook';
import type { books_v1 } from '@googleapis/books';

export function stripGoogleBookCurl(url?: string) {
	if (!url) {
		return '';
	}
	try {
		const u = new URL(url);
		u.searchParams.delete('edge');
		return u.toString();
	} catch (error) {
		console.error(error);
	}
}

export function setZoomLevel(url?: string, zoom: 0 | 1 | 2 | 3 | 4 | 5 = 0) {
	if (!url) {
		return '';
	}
	try {
		const u = new URL(url);
		u.searchParams.set('zoom', '0');
		console.log({ u });
		return u.toString();
	} catch (error) {
		console.error(error);
	}
}

export function get_genre(book: Book) {
	console.log({ book });
	if (!book.volumeInfo?.categories) {
		return 'Non-fiction';
	}
	if (book.volumeInfo?.categories?.some((c) => c.startsWith('Fiction /'))) {
		return 'Fiction';
	} else if (
		book.volumeInfo?.categories?.some((c) => c.startsWith('Poetry /'))
	) {
		return 'Poetry';
	} else {
		return 'Non-fiction';
	}
}

function find_first<TString extends string>(
	arr: Array<string>,
	...search: Array<TString | [string, TString]>
): TString | undefined {
	for (const a of arr) {
		for (const s of search) {
			const term = typeof s === 'string' ? s : s[0];
			if (a.includes(term)) {
				const val = typeof s === 'string' ? s : s[1];
				return val;
			}
		}
	}
}

export function get_category(book: Book) {
	const genre = get_genre(book);
	console.log({ book, genre });
	const categories = book.volumeInfo?.categories;
	if (genre === 'Fiction' && categories) {
		if (categories.some((c) => c.includes('Fantasy'))) {
			return 'Fantasy';
		} else if (categories.some((c) => c.includes('Science Fiction'))) {
			return 'Science Fiction';
		}
		if (categories.some((c) => c.includes('Young Adult'))) {
			return 'Young Adult';
		}
		if (categories.some((c) => c.includes('Thriller'))) {
			return 'Thriller';
		}
		return 'Fiction & Literature';
	} else if (genre === 'Fiction') {
		return 'Fiction & Literature';
	} else if (categories) {
		const polsoc = find_first(
			categories,
			['Political Science', 'Politics'],
			'Social Science',
			// TODO: regex
			'Science',
		);
		if (polsoc) {
			return polsoc;
		}
		// if (categories.some((c) => c.includes('Political Science'))) {
		// 	return 'Politics';
		// }
		if (categories.some((c) => c.includes('Philosophy'))) {
			return 'Philosophy';
		}
		if (categories.some((c) => c.startsWith('Psychology'))) {
			return 'Psychology';
		}
		if (categories.some((c) => c.startsWith('History'))) {
			return 'History';
		}
		if (categories.some((c) => /\bFilm\b/.test(c))) {
			return 'Film';
		}
		if (
			categories.some(
				(c) => c.startsWith('Performing Arts') || c.startsWith('Arts'),
			)
		) {
			return 'Arts';
		}
		// if (categories.some((c) => c.includes('Social Science'))) {
		// 	return 'Social Science';
		// }
		if (categories.some((c) => c.includes('Cooking'))) {
			return 'Cooking';
		}
		if (categories.some((c) => c.includes('Business'))) {
			return 'Business';
		}
		if (categories.some((c) => c.includes('Biography & Autobiography'))) {
			return 'Biography & Autobiography';
		}
		if (categories.some((c) => c.includes('Health & Fitness'))) {
			return 'Health';
		}
	}
	return 'Non-fiction';
}

export function getGbookImage(book: Book) {
	const { volumeInfo } = book;
	if (!volumeInfo) {
		return '';
	}
	const { imageLinks } = volumeInfo;
	if (!imageLinks) {
		return;
	}
	const { extraLarge, large, medium, small, thumbnail } = imageLinks;
	// try thumbnail first, setting zoom to 0 and removing curl
	// if that fails, try small, medium, large, extraLarge
	if (thumbnail) {
		const url = new URL(thumbnail);
		// url.searchParams.set("zoom", "0");
		url.searchParams.delete('edge');
		return url.href;
	}

	return extraLarge ?? large ?? medium ?? small ?? thumbnail;
}

export function getCategoryIcon(category: ReturnType<typeof get_category>) {
	switch (category) {
		case 'Fantasy':
			return SwordIcon;
		case 'Science Fiction':
			return BotIcon;
		case 'Young Adult':
			return '👶';
		case 'Thriller':
			return '🔪';
		case 'Fiction & Literature':
			return BookIcon;
		case 'Politics':
			return SpeechIcon;
		case 'Philosophy':
			return LightbulbIcon;
		case 'Psychology':
			return BrainIcon;
		case 'History':
			return '📜';
		case 'Social Science':
			return Users2Icon;
		case 'Cooking':
			return '🍳';
		case 'Business':
			return '💼';
		case 'Biography & Autobiography':
			return '👨';
		case 'Health':
			return '🏥';
		case 'Arts':
			return '🎨';
		case 'Film':
			return FilmIcon;
		default:
			return BookIcon;
	}
}

export function deDupeGoogleBooksList(
	books: Array<books_v1.Schema$Volume>,
): Array<books_v1.Schema$Volume> {
	console.log({
		unduped: books,
	});
	const uniqueBooks = new Map<string, books_v1.Schema$Volume>();
	const metadataScores = new Map<string, number>();
	books.forEach((book) => {
		if (!book.volumeInfo) {
			return;
		}
		const key = `${book.volumeInfo.title}-${book.volumeInfo.authors}`;
		const score = calculateMetadataScore(book);
		const existing = uniqueBooks.get(key);
		if (existing) {
			const existingScore = metadataScores.get(key) ?? 0;
			if (score > existingScore) {
				uniqueBooks.set(key, book);
				metadataScores.set(key, score);
			}
		} else {
			uniqueBooks.set(key, book);
			metadataScores.set(key, score);
		}
	});

	const deduped = Array.from(uniqueBooks.values());
	console.log({ deduped });
	return deduped.sort((a, b) => {
		return (
			(metadataScores.get(`${b.volumeInfo?.title}-${b.volumeInfo?.authors}`) ??
				0) -
			(metadataScores.get(`${a.volumeInfo?.title}-${a.volumeInfo?.authors}`) ??
				0)
		);
	});
}

function calculateMetadataScore(book: books_v1.Schema$Volume) {
	let score = 0;
	const { saleInfo, volumeInfo } = book;
	if (!volumeInfo) {
		return -100;
	}
	if (!volumeInfo.imageLinks) {
		score -= 25;
	}
	if (volumeInfo.imageLinks?.thumbnail) {
		score += 1;
	}
	if (volumeInfo.imageLinks?.small) {
		score += 1;
	}
	if (volumeInfo.imageLinks?.medium) {
		score += 1;
	}
	if (volumeInfo.imageLinks?.large) {
		score += 1;
	}
	if (volumeInfo.imageLinks?.extraLarge) {
		score += 1;
	}
	if (volumeInfo.authors?.length) {
		score += 1;
	}
	if (volumeInfo.categories?.length) {
		score += 10;
	} else {
		score -= 10;
	}
	if (volumeInfo.description) {
		score += 1;
	}
	if (volumeInfo.publisher) {
		score += 1;
	}
	if (volumeInfo.publishedDate) {
		score += 1;
	}
	if (volumeInfo.title) {
		score += 1;
	}
	if (volumeInfo.subtitle) {
		score += 1;
	}
	if (!volumeInfo.industryIdentifiers) {
		// very bad sign
		score -= 5;
	}

	score += volumeInfo.ratingsCount ?? 0;

	if (saleInfo) {
		if (saleInfo.isEbook) {
			// prefer non-ebook
			score -= 1;
		}
	}
	return score;
}
