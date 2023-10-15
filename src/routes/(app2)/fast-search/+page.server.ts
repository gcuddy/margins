import { redirect } from '@sveltejs/kit';

import { db } from '$lib/db';
import { ListEntry, entrySelect } from '$lib/db/selects';
import { sql } from 'kysely';
import { books } from '$lib/api/gbook';
import { tmdb } from '$lib/api/tmdb';

export async function load(event) {
	const session = await event.locals.auth.validate();

	if (!session) {
		throw redirect(303, '/login');
	}

	if (event.url.searchParams.has('q')) {
		const q = event.url.searchParams.get('q');
		if (!q) return;
		console.time('fast-search');

		const scope = event.url.searchParams.get('scope');

		if (scope === 'books') {
			const returnedBooks = await books.search(q);
			event.setHeaders({
				'cache-control': 'public, max-age=3600',
			});

			const entries = (returnedBooks.items ?? []).map((item) => {
				return {
					title: item.volumeInfo?.title ?? null,
					image: item.volumeInfo?.imageLinks?.thumbnail ?? null,
					published: item.volumeInfo?.publishedDate
						? new Date(item.volumeInfo?.publishedDate)
						: null,
					type: 'book',
					author: item.volumeInfo?.authors?.join(', ') ?? null,
					googleBooksId: item.id ?? null,
				} satisfies Partial<ListEntry>;
			});

			return { entries };
		} else if (scope === 'movies' || scope === 'tv') {
			const returnedMovies = await tmdb.search(scope, q);
			event.setHeaders({
				'cache-control': 'public, max-age=3600',
			});
		}

		let entries = await db
			.selectFrom('Entry as e')
			.leftJoin('Bookmark as b', 'b.entryId', 'e.id')
			.leftJoin('Subscription as s', 's.feedId', 'e.feedId')
			.select(entrySelect)
			.select('text as matchedText')
			// .select(sql`match(title,author)`)
			// TODO: select score for title+author and boost (1.5) above text
			.select(
				sql`match (e.title,e.author) against (${q} in boolean mode)`.as(
					'ta_score',
				),
			)
			.select(
				sql`match (e.text) against (${q} in boolean mode)`.as('text_score'),
			)
			.where((eb) =>
				eb.or([
					eb('b.userId', '=', session.user.userId),
					eb('s.userId', '=', session.user.userId),
				]),
			)
			.where(
				sql`match (e.title,e.author,e.text) against (${q} in boolean mode)`,
			)
			.distinct()
			.limit(50)
			.orderBy(sql`(ta_score * 1.5) + text_score desc`)
			.execute();

		console.timeEnd('fast-search');

		const searchTerm = q;
		const regex = new RegExp(searchTerm, 'gi');

		/**
		 * Get text surrounding the match and highlight it
		 */
		function highlightText(text: string | null, portion = false) {
			if (!text) return '';
			if (!portion) {
				return text.replace(regex, `<mark>$&</mark>`);
			}
			const match = regex.exec(text);
			if (!match) return '';
			const start = Math.max(0, match.index - 20);
			const end = Math.min(text.length, match.index + searchTerm.length + 20);
			return (
				'...' +
				text.slice(start, match.index) +
				`<mark>${match[0]}</mark>` +
				text.slice(match.index + searchTerm.length, end) +
				'...'
			);
		}

		console.time('highlight');

		entries = entries.map((entry) => {
			return {
				...entry,
				title: highlightText(entry.title),
				author: highlightText(entry.author),
				matchedText: highlightText(entry.matchedText, true),
			};
		});

		console.timeEnd('highlight');

		return {
			entries,
		};
	}
}
