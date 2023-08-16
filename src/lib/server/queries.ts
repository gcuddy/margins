import { books } from '$lib/api/gbook';
import spotify from '$lib/api/spotify';
import { tmdb } from '$lib/api/tmdb';
import { db } from '$lib/db';
import { entrySelect } from '$lib/db/selects';
import type { Bookmark, DB, Entry, Interaction } from '$lib/prisma/kysely/types';
import { typeSchema, type Type } from '$lib/types';
import { Status } from '@prisma/client';
import { sql, type ExpressionBuilder } from 'kysely';
import type { Nullable } from 'kysely/dist/cjs/util/type-utils';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import pindex from '$lib/api/pindex';
import { z } from 'zod';

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

const defaultCursorSchema = z.object({
	sort_order: z.number(),
	updatedAt: z.coerce.date()
});

const entryListSortSchemas = z.union([
	z.object({
		sort: z.literal('manual').nullish(),
		// order: z.nativeEnum(['asc', 'desc']),
		cursor: defaultCursorSchema.nullish()
	}),
	z.object({
		sort: z.literal('updatedAt'),
		cursor: z
			.object({
				updatedAt: z.coerce.date(),
				id: z.number()
			})
			.nullish()
	}),
	z.object({
		// sort: z.nu
		sort: z.literal('title'),
		cursor: z
			.object({
				title: z.string(),
				id: z.number()
			})
			.nullish()
	}),
	z.object({
		sort: z.literal('author'),
		cursor: z
			.object({
				author: z.string(),
				id: z.number()
			})
			.nullish()
	})
]);

const relativeDatesSchema = z.object({
	num: z.number().int().positive(),
	unit: z.enum(['day', 'week', 'month', 'year'])
});

const gte = z.object({
	gte: z.coerce.date().or(relativeDatesSchema)
});

const lte = z.object({
	lte: z.coerce.date().or(relativeDatesSchema)
});

const equals = z.object({
	equals: z.coerce.date()
});

export const filterLibrarySchema = z.object({
	createdAt: z.union([gte, lte, equals]).optional()
});
export type FilterLibrarySchema = z.input<typeof filterLibrarySchema>;

export const get_library_schema = z
	.object({
		status: z.nativeEnum(Status).nullable(), // TODO: allow custom states
		search: z.string().optional(),
		type: typeSchema.nullish(),
		filter: filterLibrarySchema.optional()
	})
	.and(entryListSortSchemas);

export type GetLibrarySchema = z.input<typeof get_library_schema>;

export type LibrarySortType = GetLibrarySchema['sort'];

export async function get_library({
	userId,
	cursor,
	status,
	search,
	sort,
	type,
	filter
}: { userId: string } & z.input<typeof get_library_schema>) {
	const take = 25;
	console.log(`[get_library]`, { cursor });
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
		// .orderBy('b.sort_order', 'asc')
		// .orderBy('b.updatedAt', 'desc')
		.limit(take + 1);
	if (status) {
		query = query.where('b.status', '=', status);
	}
	switch (sort) {
		case null:
		case undefined:
		case 'manual': {
			query = query.orderBy('b.sort_order', 'asc').orderBy('b.updatedAt', 'desc');
			if (cursor) {
				query = query
					.where('b.sort_order', '>=', cursor.sort_order)
					.where('b.updatedAt', '<', cursor.updatedAt);
			}
			break;
		}
		case 'updatedAt': {
			query = query.orderBy('b.updatedAt', 'desc').orderBy('b.id', 'asc');
			if (cursor) {
				query = query.where((eb) =>
					eb.or([
						eb('b.updatedAt', '<', cursor.updatedAt),
						eb('b.updatedAt', '=', cursor.updatedAt).and('e.id', '>', cursor.id)
					])
				);
			}
			break;
		}
		case 'title': {
			query = query.orderBy('e.title', 'asc').orderBy('e.id', 'asc');
			if (cursor) {
				query = query.where((eb) =>
					eb.or([
						eb('e.title', '>', cursor.title),
						eb('e.title', '=', cursor.title).and('e.id', '>', cursor.id)
					])
				);
			}
			break;
		}
		case 'author': {
			query = query.orderBy('e.author', 'asc').orderBy('e.id', 'asc');
			if (cursor) {
				query = query.where((eb) =>
					eb.or([
						eb('e.author', '>', cursor.author),
						eb('e.author', '=', cursor.author).and('e.id', '>', cursor.id)
					])
				);
			}
		}
	}
	if (search) {
		query = query.where('e.title', 'like', `%${search}%`);
	}
	if (type) {
		query = query.where('e.type', '=', type);
	}
	if (filter) {
		const { createdAt } = filter;
		if (createdAt) {
			if ('gte' in createdAt && createdAt.gte) {
				if (createdAt.gte instanceof Date) {
					query = query.where('e.createdAt', '>=', createdAt.gte);
				} else {
					query = query.where(
						'b.createdAt',
						'>=',
						sql`NOW() - INTERVAL ${createdAt.gte.num} ${createdAt.gte.unit}`
					);
					// interval
				}
			} else if ('lte' in createdAt && createdAt.lte) {
				if (createdAt.lte instanceof Date) {
					query = query.where('e.createdAt', '<=', createdAt.lte);
				} else {
					query = query.where(
						'b.createdAt',
						'<=',
						sql`NOW() - INTERVAL ${sql.raw(
							createdAt.lte.num.toString() + ' ' + createdAt.lte.unit
						)}`
					);
				}
			} else if ('equals' in createdAt && createdAt.equals) {
				// use between start of day and end of day for equals
				const date = new Date(createdAt.equals).toISOString().slice(0, 10);
				query = query.where(
					sql`b.createdAt >= "${sql.raw(date)} 00:00:00"  AND b.createdAt <= "${sql.raw(date)} 23:59:59"`
				);
			}
		}
	}
	const entries = await query.execute();
	let nextCursor = null;
	if (entries.length > take) {
		const nextItem = entries.pop();
		if (nextItem) {
			// go through sort options
			console.log({ sort });
			switch (sort) {
				case null:
				case undefined:
				case 'manual': {
					nextCursor = {
						updatedAt: nextItem.updatedAt,
						sort_order: nextItem.sort_order
					};
					break;
				}
				// TODO continue here with cursors
				case 'author': {
					nextCursor = {
						author: nextItem.author,
						id: nextItem.id
					};
					break;
				}
				case 'title': {
					nextCursor = {
						title: nextItem.title,
						id: nextItem.id
					};
					break;
				}
				case 'updatedAt': {
					nextCursor = {
						updatedAt: nextItem.updatedAt,
						id: nextItem.id
					};
				}
			}
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
