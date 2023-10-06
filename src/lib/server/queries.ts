import type { DocumentType, Status } from '@prisma/client';
import type { JSONContent } from '@tiptap/core';
import { type ExpressionBuilder, sql } from 'kysely';
import type { Nullable } from 'kysely/dist/cjs/util/type-utils';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import type { z } from 'zod';

import type { TargetSchema } from '$lib/annotation';
import { books } from '$lib/api/gbook';
import pindex from '$lib/api/pindex';
import spotify from '$lib/api/spotify';
import { tmdb } from '$lib/api/tmdb';
import { db } from '$lib/db';
import { getCursor } from '$lib/db/queries/library';
import { entrySelect } from '$lib/db/selects';
import type {
	Bookmark,
	DB,
	Entry,
	Interaction,
} from '$lib/prisma/kysely/types';
import {
	entryListSortSchemas,
	filterLibrarySchema,
	get_library_schema,
} from '$lib/schemas/library';
import type { Type } from '$lib/types';
import {
	applyFilter,
	generateComparatorClause,
} from '$lib/db/utils/comparators';

type AliasedEb = ExpressionBuilder<
	DB &
		Record<'b', Bookmark> &
		Record<'e', Entry> &
		Record<'i', Nullable<Interaction>>,
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
				'Annotation.title',
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

export { get_library_schema };

export type GetLibrarySchema = z.input<typeof get_library_schema>;

export type LibrarySortType = GetLibrarySchema['sort'];

// TODO: this is hard-coded in here, but ideally should come from the db...

/* eslint-disable sort-keys-fix/sort-keys-fix */
export const TypeToIndex: Record<DocumentType, number> = {
	article: 1,
	podcast: 2,
	rss: 3,
	pdf: 4,
	epub: 5,
	bookmark: 6,
	image: 7,
	video: 8,
	tweet: 9,
	audio: 10,
	book: 11,
	movie: 12,
	tv: 13,
	song: 14,
	album: 15,
	playlist: 16,
	recipe: 17,
	game: 18,
	board_game: 19,
} as const;
/* eslint-enable sort-keys-fix/sort-keys-fix */

export async function get_library({
	cursor,
	dir,
	filter,
	grouping,
	library,
	search,
	sort,
	status,
	userId,
}: { userId: string } & z.infer<typeof get_library_schema>) {
	const take = 25;
	let query = db
		.selectFrom('Entry as e')
		.leftJoin('Bookmark as b', (join) =>
			join.onRef('b.entryId', '=', 'e.id').on('b.userId', '=', userId),
		)
		.leftJoin('Feed as f', 'f.id', 'e.feedId')
		.leftJoin('EntryInteraction as i', (j) =>
			j.onRef('i.entryId', '=', 'e.id').on('i.userId', '=', userId),
		)
		.select([
			'e.id',
			'e.type',
			'e.summary',
			'e.title',
			'e.author',
			'e.uri',
			'e.tmdbId',
			'e.googleBooksId',
			'e.podcastIndexId',
			'e.published',
			'b.updatedAt',
			// 'e.html',
			'e.wordCount',
			'e.estimatedReadingTime',
			'e.spotifyId',
			'b.status',
			'b.sort_order',
			// hate how i've done this!
			'b.title as bookmark_title',
			'b.author as bookmark_author',
			// TODO: make this an actual property that gets computed when the bookmark is *saved* (since technically a bookmark can not be in the library)
			'b.createdAt as savedAt',
			'i.progress',
			'i.finished',
			'i.seen',
			'i.currentPage',
		])
		.select(({ fn }) => fn.coalesce('e.image', 'f.imageUrl').as('image'))
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
						'Annotation.exact',
					])
					// .select((eb) => eb.fn.countAll('Annotation').as('num_annotations'))
					// .select(eb.fn.count("Annotation.id").as("count")
					.whereRef('Annotation.entryId', '=', 'e.id')
					.where('Annotation.userId', '=', userId)
					.orderBy('Annotation.start', 'asc')
					.orderBy('Annotation.createdAt', 'asc')
					// TODO: add count column to get all
					.limit(10),
			).as('annotations'),
			jsonObjectFrom(
				eb
					.selectFrom('EntryInteraction as i')
					.select(['i.progress'])
					.whereRef('i.entryId', '=', 'e.id')
					.where('i.userId', '=', userId),
			).as('interaction'),
			jsonArrayFrom(
				eb
					.selectFrom('Tag')
					.select(['Tag.id', 'Tag.name', 'Tag.color'])
					.innerJoin('TagOnEntry as et', 'et.tagId', 'Tag.id')
					.whereRef('et.entryId', '=', 'e.id'),
			).as('tags'),
			jsonArrayFrom(
				eb
					.selectFrom('Collection')
					.select(['Collection.id', 'Collection.name'])
					.innerJoin(
						'CollectionItems as ci',
						'ci.collectionId',
						'Collection.id',
					)
					.whereRef('ci.entryId', '=', 'e.id'),
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
								.select(entrySelect),
						).as('entry'),
					)
					.unionAll(
						eb
							.selectFrom('Relation as r')
							.select(['r.id', 'r.type', 'r.entryId', 'r.relatedEntryId'])
							.select((eb) =>
								jsonObjectFrom(
									eb
										.selectFrom('Entry as e')
										.whereRef('e.id', '=', 'r.entryId')
										.select(entrySelect),
								).as('entry'),
							)
							.whereRef('r.relatedEntryId', '=', 'e.id'),
					),
			).as('relations'),
			eb
				.selectFrom('Annotation')
				.whereRef('Annotation.entryId', '=', 'e.id')
				.where('Annotation.userId', '=', userId)
				.select((eb) => eb.fn.count('Annotation.id').as('n'))
				.as('num_annotations'),
		])
		.limit(take + 1);
	if (status) {
		query = query.where('b.status', '=', status);
	}

	if (library) {
		// TODO: b.bookmarked should be a date!
		query = query.where('b.userId', '=', userId).where('b.bookmarked', '=', 1);
	}

	// check for grouping. if that's there, we need to sort by that first, then by the sort
	if (grouping) {
		if (grouping === 'domain') {
			// TODO
		} else if (grouping === 'tag') {
			// TODO
		} else if (grouping === 'type') {
			query = query.orderBy('e.type');
		} else {
			// grouping satisfies never;
		}
	}

	const order = dir === 'desc' ? 'desc' : 'asc';
	const rorder = dir === 'desc' ? 'asc' : 'desc';
	const up = order === 'asc';
	switch (sort) {
		case null:
		case undefined:
		case 'manual': {
			query = query.orderBy('b.sort_order', order).orderBy('e.id', order);
			if (cursor) {
				query = query.where((eb) => {
					const exp = eb.or([
						eb('b.sort_order', up ? '>' : '<', cursor.sort_order),
						eb('b.sort_order', '=', cursor.sort_order).and(
							'e.id',
							up ? '>=' : '<=',
							cursor.id,
						),
					]);

					if (grouping === 'type' && cursor.type) {
						// return sql`e.type > ${type} or (b.sort_order > ${})`
						const typeIndex = TypeToIndex[
							cursor.type
						] as unknown as DocumentType;
						return eb.or([
							eb('e.type', '>', typeIndex),
							eb('e.type', '=', typeIndex).and(exp),
						]);
					} else if (grouping === 'tag' && cursor.tag) {
						// TODO
					} else if (grouping === 'domain' && cursor.domain) {
						// TODO
					}
					return exp;
				});
			}
			break;
		}
		case 'updatedAt': {
			query = query.orderBy('b.updatedAt', order).orderBy('e.id', rorder);
			if (cursor) {
				query = query.where((eb) =>
					eb.or([
						eb('b.updatedAt', up ? '>' : '<', cursor.updatedAt),
						eb('b.updatedAt', '=', cursor.updatedAt).and(
							'e.id',
							up ? '>=' : '<=',
							cursor.id,
						),
					]),
				);
			}
			break;
		}
		case 'createdAt': {
			query = query.orderBy('b.createdAt', order).orderBy('e.id', rorder);
			if (cursor) {
				query = query.where((eb) =>
					eb.or([
						eb('b.createdAt', up ? '>' : '<', cursor.createdAt),
						eb('b.createdAt', '=', cursor.createdAt).and(
							'e.id',
							up ? '>=' : '<=',
							cursor.id,
						),
					]),
				);
			}
			break;
		}
		case 'title': {
			query = query.orderBy('e.title', order).orderBy('e.id', order);
			if (cursor) {
				query = query.where((eb) =>
					eb.or([
						eb('e.title', up ? '>' : '<', cursor.title),
						eb('e.title', '=', cursor.title).and(
							'e.id',
							up ? '>=' : '<=',
							cursor.id,
						),
					]),
				);
			}
			break;
		}
		case 'author': {
			query = query
				.orderBy((eb) => eb.fn.coalesce('b.author', 'e.author'), order)
				.orderBy('e.id', order);
			if (cursor) {
				query = query.where((eb) =>
					eb.or([
						eb(
							eb.fn.coalesce('b.author', 'e.author'),
							up ? '>' : '<',
							cursor.author,
						),
						eb(eb.fn.coalesce('b.author', 'e.author'), '=', cursor.author).and(
							'e.id',
							up ? '>=' : '<=',
							cursor.id,
						),
					]),
				);
			}
			break;
		}
		case 'time': {
			// TODO: coalesce estimatedreadingtime and runtime
			// TODO: we shuold probably not filter on a sort, but this is fine for now
			query = query.where('e.estimatedReadingTime', 'is not', null);
			query = query
				.orderBy('e.estimatedReadingTime', order)
				.orderBy('e.id', order);
			if (cursor) {
				query = query.where((eb) =>
					eb.or([
						eb('e.estimatedReadingTime', up ? '>' : '<', cursor.time),
						eb('e.estimatedReadingTime', '=', cursor.time).and(
							'e.id',
							up ? '>=' : '<=',
							cursor.id,
						),
					]),
				);
			}
			break;
		}
		case 'published': {
			query = query.orderBy('e.published', order).orderBy('e.id', 'asc');
			if (cursor) {
				query = query.where((eb) =>
					eb.or([
						eb('e.published', up ? '>' : '<', cursor.published),
						eb('e.published', '=', cursor.published).and(
							'e.id',
							'>',
							cursor.id,
						),
					]),
				);
			}
			break;
		}
	}

	if (search) {
		query = query.where((eb) =>
			eb.or([
				eb('e.title', 'like', `%${search}%`),
				eb(eb.fn.coalesce('b.author', 'e.title'), 'like', `%${search}%`),
			]),
		);
	}
	if (filter) {
		const {
			author,
			book_genre,
			createdAt,
			domain,
			feed,
			published,
			readingTime,
			status,
			tags,
			title,
			type,
			..._rest
		} = filter;
		// TODO: put this into a functino for exhaustiveness check
		if (type) {
			query = query.where('e.type', '=', type);
		}
		if (createdAt) {
			const createdAts = Array.isArray(createdAt) ? createdAt : [createdAt];
			for (const createdAt of createdAts) {
				if ('gte' in createdAt && createdAt.gte) {
					query =
						createdAt.gte instanceof Date
							? query.where('e.createdAt', '>=', createdAt.gte)
							: query.where(
									'b.createdAt',
									'<=',
									sql`NOW() - INTERVAL ${sql.raw(
										`${createdAt.gte.num} ${createdAt.gte.unit}`,
									)}`,
							  );
				} else if ('lte' in createdAt && createdAt.lte) {
					query =
						createdAt.lte instanceof Date
							? query.where('e.createdAt', '<=', createdAt.lte)
							: query.where(
									'b.createdAt',
									'>=',
									sql`NOW() - INTERVAL ${sql.raw(
										`${createdAt.lte.num.toString()} ${createdAt.lte.unit}`,
									)}`,
							  );
				} else if ('equals' in createdAt && createdAt.equals) {
					// use between start of day and end of day for equals
					const date = new Date(createdAt.equals).toISOString().slice(0, 10);
					query = query.where(
						sql`b.createdAt >= "${sql.raw(
							date,
						)} 00:00:00"  AND b.createdAt <= "${sql.raw(date)} 23:59:59"`,
					);
				}
			}
		}
		if (tags) {
			query =
				!tags.type || tags.type === 'or'
					? query.where((eb) =>
							eb.exists(
								eb
									.selectFrom('TagOnEntry')
									.select('TagOnEntry.id')
									.whereRef('TagOnEntry.entryId', '=', 'e.id')
									.where('TagOnEntry.tagId', 'in', tags.ids),
							),
					  )
					: query.where(({ eb, selectFrom }) =>
							eb(
								selectFrom('TagOnEntry')
									.select(({ fn }) => fn.count('TagOnEntry.id').as('count'))
									.distinct()
									.whereRef('TagOnEntry.entryId', '=', 'e.id')
									.where('TagOnEntry.tagId', 'in', tags.ids),
								'=',
								tags.ids.length,
							),
					  );
		}
		if (readingTime) {
			const { max, min } = readingTime;
			if (min) {
				query = query.where('e.estimatedReadingTime', '>=', min);
			}
			if (max) {
				query = query.where('e.estimatedReadingTime', '<=', max);
			}
		}
		if (domain) {
			query = query
				.where('e.uri', 'is not', null)
				.where('e.uri', 'regexp', '^(http|https)://')
				.where(
					sql`SUBSTRING_INDEX(SUBSTRING_INDEX(e.uri, '/', 3), '//', -1) = ${domain}`,
				);
		}
		if (book_genre) {
			query = query.where('e.book_genre', '=', book_genre);
		}
		if (feed) {
			query = query.where((eb) =>
				generateComparatorClause(eb, 'e.feedId', feed),
			);
		}
		if (published) {
			query = query.where((eb) => applyFilter(eb, { published }));
		}
		if (title) {
			query = query.where((eb) =>
				generateComparatorClause(
					eb,
					eb.fn.coalesce('b.title', 'e.title'),
					title,
				),
			);
			// query = query.where((eb) => applyFilter(eb, { title }));
		}
		if (status) {
			query = query.where((eb) =>
				generateComparatorClause(eb, 'b.status', status),
			);
		}
		if (author) {
			query = query.where((eb) =>
				generateComparatorClause(
					eb,
					eb.fn.coalesce('b.author', 'e.author'),
					author,
				),
			);
		}
	}
	const entries = await query.execute();
	let nextCursor: GetLibrarySchema['cursor'] = null;
	if (entries.length > take) {
		const nextItem = entries.pop();
		if (nextItem) {
			nextCursor = getCursor({
				grouping,
				nextItem,
				sort,
			});
		}
	}
	return {
		entries,
		nextCursor,
	};
}

export type LibraryResponse = Awaited<ReturnType<typeof get_library>>;

export type LibraryEntry = LibraryResponse['entries'][number];

export async function get_entry_details(
	id: string | number,
	opts?: {
		type: Type;
		use_entry_id?: boolean;
		userId?: string;
	},
) {
	const { type, userId } = opts || {};
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
			'youtubeId',
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
							'Annotation.exact',
						])
						.whereRef('Annotation.entryId', '=', 'Entry.id')
						.where('Annotation.userId', '=', userId!)
						.$narrowType<{
							contentData: JSONContent | null;
							target: TargetSchema | null;
						}>()
						.orderBy('Annotation.start', 'asc')
						.orderBy('Annotation.createdAt', 'asc')
						.limit(100),
				).as('annotations'),
				jsonArrayFrom(
					eb
						.selectFrom('Collection as c')
						.select(['c.id', 'c.name'])
						.innerJoin('CollectionItems as ci', 'ci.collectionId', 'c.id')
						.whereRef('ci.entryId', '=', 'Entry.id')
						.where('c.userId', '=', userId!),
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
										'e.podcastIndexId',
									]),
							).as('related_entry'),
						)
						.whereRef('r.entryId', '=', 'Entry.id')
						.where('r.userId', '=', userId!),
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
										'e.podcastIndexId',
									]),
							).as('related_entry'),
						)
						.whereRef('r.relatedEntryId', '=', 'Entry.id')
						.where('r.userId', '=', userId!),
				).as('back_relations'),
				jsonArrayFrom(
					eb
						.selectFrom('TagOnEntry as toe')
						.innerJoin('Tag as t', 't.id', 'toe.tagId')
						.select(['t.id', 't.name'])
						.whereRef('toe.entryId', '=', 'Entry.id')
						.where('toe.userId', '=', userId!),
				).as('tags'),
				jsonObjectFrom(
					eb
						.selectFrom('Bookmark')
						.select(['id', 'status'])
						.whereRef('Bookmark.entryId', '=', 'Entry.id')
						.where('Bookmark.userId', '=', userId!),
				).as('bookmark'),
				jsonObjectFrom(
					eb
						.selectFrom('EntryInteraction as i')
						.select([
							'i.id',
							'i.currentPage',
							'i.progress',
							'i.started',
							'i.finished',
							'i.title',
							'i.note',
						])
						.whereRef('i.entryId', '=', 'Entry.id')
						.where('i.userId', '=', userId!)
						.limit(1),
				).as('interaction'),
			]),
		)
		.$if(type === 'tweet', (qb) => qb.select(['Entry.original as tweet']));

	if (!opts?.use_entry_id) {
		switch (type) {
			case 'movie':
				query = query
					.where('Entry.tmdbId', '=', +id)
					.where('Entry.type', '=', 'movie');
				break;
			case 'tv':
				query = query
					.where('Entry.tmdbId', '=', +id)
					.where('Entry.type', '=', 'tv');
				break;
			case 'book':
				query = query
					// .where("Entry.uri", "=", `isbn:${id}`);
					.where('Entry.googleBooksId', '=', id.toString());
				break;
			case 'podcast': {
				// if id starts with p, this indicates it's a pointer to the podcastindexid
				// else, it's a podcast saved without a podcastindexid (i.e. a private podcast or something of the sort)
				const podcastIndexId = id.toString().startsWith('p')
					? id.toString().slice(1)
					: undefined;
				// console.log({ podcastIndexId });
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
		album: type === 'album' ? spotify.album(id.toString()) : null,
		book: type === 'book' ? books.get(id.toString()) : null,
		entry,
		movie: type === 'movie' ? tmdb.movie.details(+id) : null,
		tv: type === 'tv' ? tmdb.tv.details(+id) : null,
	};
}

export type EntryDetails = Awaited<ReturnType<typeof get_entry_details>>;
