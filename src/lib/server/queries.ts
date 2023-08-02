import { books } from '$lib/api/gbook';
import spotify from '$lib/api/spotify';
import { tmdb } from '$lib/api/tmdb';
import { db } from '$lib/db';
import { entrySelect } from '$lib/db/selects';
import type { Bookmark, DB, Entry, Interaction } from '$lib/prisma/kysely/types';
import type { Type } from '$lib/types';
import type { Status } from '@prisma/client';
import type { ExpressionBuilder } from 'kysely';
import type { Nullable } from 'kysely/dist/cjs/util/type-utils';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import pindex from '$lib/api/pindex';

type AliasedEb = ExpressionBuilder<
	DB & Record<'b', Bookmark> & Record<'e', Entry> & Record<'i', Nullable<Interaction>>,
	'b' | 'e' | 'i'
>;

function get_annotations(eb: AliasedEb, userId: string) {
	return (
		eb
			.selectFrom('Annotation')
			.innerJoin('auth_user', 'auth_user.id', 'Annotation.userId')
			.select([
				'Annotation.id',
				'Annotation.contentData',
				'Annotation.start',
				'Annotation.body',
				'Annotation.target',
				'Annotation.entryId',
				'auth_user.username',
				'Annotation.title'
			])
			// .select(eb.fn.count("Annotation.id").as("count")
			.whereRef('Annotation.entryId', '=', 'e.id')
			.where('Annotation.userId', '=', userId)
			.orderBy('Annotation.start', 'asc')
			.limit(10)
			.orderBy('Annotation.createdAt', 'asc')
			.compile()
	);
}

export async function get_library(
	userId: string,
	status: Status | null,
	filter: {
		type?: Type;
		search?: string;
	} = {},
	cursor?: { sort_order: number; updatedAt: Date }
) {
	const take = 25;
	console.log(`[get_library]`, { cursor, filter });
	let query = db
		.selectFrom('Bookmark as b')
		.innerJoin('Entry as e', 'e.id', 'b.entryId')
		.leftJoin('EntryInteraction as i', (j) =>
			j.onRef('i.entryId', '=', 'e.id').on('i.userId', '=', userId)
		)
		.select([
			'e.id',
			'e.image',
			'e.published',
			'e.type',
			'e.title',
			'e.author',
			'e.uri',
			'e.tmdbId',
			'e.googleBooksId',
			'e.podcastIndexId',
			'b.updatedAt',
			'e.wordCount',
			'e.spotifyId',
			'b.status',
			'b.sort_order',
			'i.progress',
			'i.currentPage'
		])
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom('Annotation')
					.innerJoin('auth_user', 'auth_user.id', 'Annotation.userId')
					.select([
						'Annotation.id',
						'Annotation.contentData',
						'Annotation.start',
						'Annotation.body',
						'Annotation.target',
						'Annotation.entryId',
						'auth_user.username',
						'Annotation.title',
						'Annotation.createdAt',
						'Annotation.exact'
					])
					// .select((eb) => eb.fn.countAll('Annotation').as('num_annotations'))
					// .select(eb.fn.count("Annotation.id").as("count")
					.whereRef('Annotation.entryId', '=', 'e.id')
					.where('Annotation.userId', '=', userId)
					.orderBy('Annotation.start', 'asc')
					.orderBy('Annotation.createdAt', 'asc')
					// TODO: add count column to get all
					.limit(10)
			).as('annotations'),
			jsonObjectFrom(
				eb
					.selectFrom('EntryInteraction as i')
					.select(['i.progress'])
					.whereRef('i.entryId', '=', 'e.id')
					.where('i.userId', '=', userId)
			).as('interaction'),
			jsonArrayFrom(
				eb
					.selectFrom('Tag')
					.select(['Tag.id', 'Tag.name'])
					.innerJoin('TagOnEntry as et', 'et.tagId', 'Tag.id')
					.whereRef('et.entryId', '=', 'e.id')
			).as('tags'),
			jsonArrayFrom(
				eb
					.selectFrom('Collection')
					.select(['Collection.id', 'Collection.name'])
					.innerJoin('CollectionItems as ci', 'ci.collectionId', 'Collection.id')
					.whereRef('ci.entryId', '=', 'e.id')
			).as('collections'),
			jsonArrayFrom(
				eb
					.selectFrom('Relation as r')
					.whereRef('r.entryId', '=', 'e.id')
					.select(['r.id', 'r.type', 'r.entryId', 'r.relatedEntryId'])
					.select((eb) =>
						jsonObjectFrom(
							eb
								.selectFrom('Entry as e')
								.whereRef('e.id', '=', 'r.relatedEntryId')
								.select(entrySelect)
						).as('entry')
					)
					.unionAll(
						eb
							.selectFrom('Relation as r')
							.select(['r.id', 'r.type', 'r.entryId', 'r.relatedEntryId'])
							.select((eb) =>
								jsonObjectFrom(
									eb.selectFrom('Entry as e').whereRef('e.id', '=', 'r.entryId').select(entrySelect)
								).as('entry')
							)
							.whereRef('r.relatedEntryId', '=', 'e.id')
					)
			).as('relations'),
			eb
				.selectFrom('Annotation')
				.whereRef('Annotation.entryId', '=', 'e.id')
				.where('Annotation.userId', '=', userId)
				.select((eb) => eb.fn.count('Annotation.id').as('n'))
				.as('num_annotations')
		])
		.where('b.userId', '=', userId)
		.orderBy('b.sort_order', 'asc')
		.orderBy('b.updatedAt', 'desc')
		.limit(take + 1);
	if (status) {
		query = query.where('b.status', '=', status);
	}
	if (cursor) {
		console.log(`adding cursor`);
		query = query.where('b.sort_order', '>=', cursor.sort_order);
		query = query.where('b.updatedAt', '<', cursor.updatedAt);
	}
	if (filter.search) {
		query = query.where('e.title', 'like', `%${filter.search}%`);
	}
	if (filter.type) {
		query = query.where('e.type', '=', filter.type);
	}
	const entries = await query.execute();
	let nextCursor = null;
	if (entries.length > take) {
		const nextItem = entries.pop();
		if (nextItem) {
			nextCursor = {
				updatedAt: nextItem.updatedAt,
				sort_order: nextItem.sort_order
			};
		}
	}
	return {
		entries,
		nextCursor
	};
}

export type LibraryResponse = Awaited<ReturnType<typeof get_library>>;

export async function get_entry_details(
	id: string | number,
	opts?: {
		type: Type;
		userId?: string;
		use_entry_id?: boolean;
	}
) {
	const { userId, type } = opts || {};
	let query = db
		.selectFrom('Entry')
		.select([
			'id',
			'title',
			'html',
			'author',
			'uri',
			'type',
			'image',
			'wordCount',
			'published',
			'podcastIndexId',
			'googleBooksId',
			'tmdbId',
			'spotifyId',
			'youtubeId'
		])
		.$if(!!userId, (q) =>
			q.select((eb) => [
				jsonArrayFrom(
					eb
						.selectFrom('Annotation')
						.innerJoin('auth_user', 'auth_user.id', 'Annotation.userId')
						.select([
							'Annotation.id',
							'Annotation.contentData',
							'Annotation.start',
							'Annotation.body',
							'Annotation.target',
							'Annotation.entryId',
							'auth_user.username',
							'Annotation.title',
							'Annotation.createdAt',
							'Annotation.exact'
						])
						.whereRef('Annotation.entryId', '=', 'Entry.id')
						.where('Annotation.userId', '=', userId!)
						.orderBy('Annotation.start', 'asc')
						.orderBy('Annotation.createdAt', 'asc')
						.limit(100)
				).as('annotations'),
				jsonArrayFrom(
					eb
						.selectFrom('Collection as c')
						.select(['c.id', 'c.name'])
						.innerJoin('CollectionItems as ci', 'ci.collectionId', 'c.id')
						.whereRef('ci.entryId', '=', 'Entry.id')
						.where('c.userId', '=', userId!)
				).as('collections'),
				jsonArrayFrom(
					eb
						.selectFrom('Relation as r')
						.select(['r.type', 'r.id'])
						.select((eb) =>
							jsonObjectFrom(
								eb
									.selectFrom('Entry as e')
									.whereRef('e.id', '=', 'r.relatedEntryId')
									.select([
										'e.title',
										'e.id',
										'e.type',
										'e.spotifyId',
										'e.tmdbId',
										'e.googleBooksId',
										'e.podcastIndexId'
									])
							).as('related_entry')
						)
						.whereRef('r.entryId', '=', 'Entry.id')
						.where('r.userId', '=', userId!)
				).as('relations'),
				// todo: compare these?
				jsonArrayFrom(
					eb
						.selectFrom('Relation as r')
						.select(['r.type', 'r.id'])
						.select((eb) =>
							jsonObjectFrom(
								eb
									.selectFrom('Entry as e')
									.whereRef('e.id', '=', 'r.entryId')
									.select([
										'e.title',
										'e.id',
										'e.type',
										'e.spotifyId',
										'e.tmdbId',
										'e.googleBooksId',
										'e.podcastIndexId'
									])
							).as('related_entry')
						)
						.whereRef('r.relatedEntryId', '=', 'Entry.id')
						.where('r.userId', '=', userId!)
				).as('back_relations'),
				jsonArrayFrom(
					eb
						.selectFrom('TagOnEntry as toe')
						.innerJoin('Tag as t', 't.id', 'toe.tagId')
						.select(['t.id', 't.name'])
						.whereRef('toe.entryId', '=', 'Entry.id')
						.where('toe.userId', '=', userId!)
				).as('tags'),
				jsonObjectFrom(
					eb
						.selectFrom('Bookmark')
						.select(['id', 'status'])
						.whereRef('Bookmark.entryId', '=', 'Entry.id')
						.where('Bookmark.userId', '=', userId!)
				).as('bookmark'),
				jsonObjectFrom(
					eb
						.selectFrom('EntryInteraction as i')
						.select([
							'i.id',
							'i.currentPage',
							'i.progress',
							'i.date_started',
							'i.date_finished',
							'i.title',
							'i.note'
						])
						.whereRef('i.entryId', '=', 'Entry.id')
						.where('i.userId', '=', userId!)
						.limit(1)
				).as('interaction')
			])
		)
		.$if(type === 'tweet', (qb) => qb.select(['Entry.original as tweet']));

	if (!opts?.use_entry_id) {
		switch (type) {
			case 'movie':
				query = query.where('Entry.tmdbId', '=', +id).where('Entry.type', '=', 'movie');
				break;
			case 'tv':
				query = query.where('Entry.tmdbId', '=', +id).where('Entry.type', '=', 'tv');
				break;
			case 'book':
				query = query
					// .where("Entry.uri", "=", `isbn:${id}`);
					.where('Entry.googleBooksId', '=', id.toString());
				break;
			case 'podcast': {
				// if id starts with p, this indicates it's a pointer to the podcastindexid
				// else, it's a podcast saved without a podcastindexid (i.e. a private podcast or something of the sort)
				const podcastIndexId = id.toString().startsWith('p') ? id.toString().slice(1) : undefined;
				console.log({ podcastIndexId });
				if (podcastIndexId) {
					query = query.where('Entry.podcastIndexId', '=', +podcastIndexId);
					break;
				}
				break;
			}
			case 'album': {
				// query = query
				query = query.where('Entry.spotifyId', '=', id.toString());
				break;
			}
			default:
				query = query.where('Entry.id', '=', +id);
				break;
		}
	} else {
		query = query.where('Entry.id', '=', +id);
	}

	const get_media = async (type: Type, id: string | number) => {
		switch (type) {
			case 'movie':
				return tmdb.movie.details(+id);
			case 'tv':
				return tmdb.tv.details(+id);
			case 'book':
				return books.get(id.toString());
			case 'podcast':
				return pindex.episodeById(+id);
			case 'album':
				return spotify.album(id.toString());
			default:
				return null;
		}
	};

	// const [entry, ]

	const entry = await query.executeTakeFirst();

	return {
		movie: type === 'movie' ? tmdb.movie.details(+id) : null,
		book: type === 'book' ? books.get(id.toString()) : null,
		tv: type === 'tv' ? tmdb.tv.details(+id) : null,
		album: type === 'album' ? spotify.album(id.toString()) : null,
		entry: query.executeTakeFirst()
	};
}
