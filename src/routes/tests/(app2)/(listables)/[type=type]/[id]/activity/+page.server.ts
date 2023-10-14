import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import type { Type } from '$lib/types';
import { jsonObjectFrom } from 'kysely/helpers/mysql';
import { entrySelect } from '$lib/db/selects';
export async function load(event) {
	// TODO: should this show all activity for all users, or just the current user?
	const session = await event.locals.auth.validate();

	if (!session) {
		throw redirect(303, `/tests/${event.params.type}/${event.params.id}/`);
	}

	const { type, id } = event.params;
	console.time('activity');

	let interactionsQuery = db
		.selectFrom('EntryInteraction as i')
		.leftJoin('Entry as e', 'e.id', 'i.entryId')
		.select([
			'i.id',
			'i.createdAt',
			'i.finished',
			'i.note',
			'i.progress',
			'i.rating',
			'i.revisit',
			'i.started',
			'i.title',
			'i.currentPage',
		]);

	interactionsQuery = interactionsQuery
		.where('i.userId', '=', session.user.userId)
		.orderBy('i.createdAt', 'desc');

	let entryQuery = db.selectFrom('Entry as e').select(entrySelect);

	switch (type as Type) {
		case 'movie':
		case 'tv': {
			interactionsQuery = interactionsQuery.where('e.tmdbId', '=', +id);
			entryQuery = entryQuery.where('tmdbId', '=', +id);
			break;
		}
		case 'book': {
			entryQuery = entryQuery.where('googleBooksId', '=', id);
			interactionsQuery = interactionsQuery.where('e.googleBooksId', '=', id);
			break;
		}
		case 'album': {
			entryQuery = entryQuery.where('spotifyId', '=', id);
			interactionsQuery = interactionsQuery.where('e.spotifyId', '=', id);
			break;
		}
		case 'podcast': {
			entryQuery = entryQuery.where('podcastIndexId', '=', +id);
			interactionsQuery = interactionsQuery.where('e.podcastIndexId', '=', +id);
			break;
		}
		default: {
			entryQuery = entryQuery.where('id', '=', +id);
			interactionsQuery = interactionsQuery.where('e.id', '=', +id);
			break;
		}
	}

	const [entry, interactions] = await Promise.all([
		entryQuery.executeTakeFirstOrThrow(),
		interactionsQuery.execute(),
	]);

	console.timeEnd('activity');

	return {
		entry,
		interactions,
	};
}
