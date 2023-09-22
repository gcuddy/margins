/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DocumentType, RelationType, Status } from '@prisma/client';
import type { JSONContent } from '@tiptap/core';
import type {
	ExpressionBuilder,
	InferResult,
	Insertable,
	ReferenceExpression,
	SelectArg,
	SelectExpression,
} from 'kysely';
import { sql } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import type { SetOptional } from 'type-fest';
import { z } from 'zod';

import { annotationSchema, type TargetSchema } from '$lib/annotation';
import { books } from '$lib/api/gbook';
import pindex from '$lib/api/pindex';
import spotify from '$lib/api/spotify';
import { tmdb } from '$lib/api/tmdb';
import { type Tweet, tweet_types } from '$lib/api/twitter';
import { db, json } from '$lib/db';
import { generateSearchNotePhrase } from '$lib/db/queries/note';
import {
	annotations,
	entrySelect,
	getFirstBookmarkSort,
	withEntry,
} from '$lib/db/selects';
import { applyFilter } from '$lib/db/utils/comparators';
import { librarySchema, tagSchema } from '$lib/features/entries/forms';
import { nanoid } from '$lib/nanoid';
import type { Annotation, DB, Entry, Favorite } from '$lib/prisma/kysely/types';
import type { idSchema } from '$lib/schemas';
import { BookmarkSchema } from '$lib/schemas/bookmark';
import { noteFilterSchema } from '$lib/schemas/inputs';
import { typeSchema } from '$lib/types';

type Ctx = {
	ctx: {
		userId: string;
	};
};

type GetCtx<T extends z.ZodTypeAny> = {
	input: z.input<T>;
} & Ctx;

export const mediaIdSchema = z.union([
	z.object({
		tmdbId: z.number().int(),
		type: z.enum(['movie', 'tv']),
	}),
	z.object({
		spotifyId: z.string(),
		type: z.enum(['album']),
	}),
	z.object({
		googleBooksId: z.string(),
		type: z.enum(['book']),
	}),
	z.object({
		podcastIndexId: z.number(),
		type: z.enum(['podcast']),
	}),
]);

const entrySchema = z.object({
	entryId: z.number().int(),
	type: z.enum(['article', 'video', 'pdf', 'tweet', 'board_game']),
});

export const entryIdAndTypeSchema = z.union([mediaIdSchema, entrySchema]);

export async function searchEntries(q: string) {
	const entries = await db
		.selectFrom('Entry')
		.where(sql`MATCH(title,author,text) AGAINST (${q})`)
		.select([
			'id',
			'title',
			'type',
			'image',
			'published',
			'author',
			'googleBooksId',
			'tmdbId',
			'podcastIndexId',
		])
		.limit(10)
		.orderBy('createdAt', 'desc')
		.execute();
	return entries;
}

const id_schema = z.coerce.number().or(z.coerce.number().array());

const id_or_entryid = z.union([
	z.object({ entryId: id_schema }),
	z.object({ id: id_schema }),
]);

export const updateBookmarkSchema = id_or_entryid.and(
	z.object({
		data: BookmarkSchema.partial()
			.omit({ context: true, data: true, id: true, userId: true })
			.extend({
				bookmarked: z.number().int().optional(),
				is_read: z.number().int().optional(),
				// private: number (0 or 1)
				private: z.number().int().optional(),
			}),
	}),
);

export type UpdateBookmarkSchema = z.input<typeof updateBookmarkSchema>;

export async function updateBookmark(
	variables: UpdateBookmarkSchema & {
		userId: string;
	},
) {
	const { data, userId } = variables;
	if ('id' in variables) {
		let bookmarks = db
			.updateTable('Bookmark')
			.set(data)
			.where('userId', '=', userId);
		const { id } = variables;
		bookmarks = Array.isArray(id)
			? bookmarks.where('id', 'in', id)
			: bookmarks.where('id', '=', id);
		return await bookmarks.execute();
	} else {
		const { entryId } = variables;
		const entryIds = Array.isArray(entryId) ? entryId : [entryId];
		const bookmarks = db
			.insertInto('Bookmark')
			.values(
				entryIds.map((entryId) => ({
					// bookmarked: 0,
					entryId,
					updatedAt: new Date(),
					userId,
					...data,
				})),
			)
			.onDuplicateKeyUpdate(data);
		return await bookmarks.execute();
		// if (Array.isArray(entryId)) {
		// 	bookmarks = bookmarks.where('entryId', 'in', entryId);
		// } else {
		// 	bookmarks = bookmarks.where('entryId', '=', entryId);
		// }
	}
}

export const getNotebookSchema = z.object({
	cursor: z.coerce.date().optional(),
});

export type GetNotebookSchema = z.infer<typeof getNotebookSchema>;

export async function getNotebook({
	cursor,
	userId,
}: GetNotebookSchema & { userId: string }) {
	console.time('notebook');
	const take = 25;
	let query = db
		.selectFrom('Annotation as a')
		.innerJoin('Entry as e', 'a.entryId', 'e.id')
		.select(annotations.select)
		// .select(withEntry)
		.where('userId', '=', userId)
		.where(({ cmpr, or }) =>
			or([cmpr('a.type', '=', 'annotation'), cmpr('a.type', '=', 'note')]),
		)
		.where('deleted', 'is', null)
		.orderBy('a.updatedAt', 'desc')
		.limit(take + 1);
	if (cursor) {
		query = query.where('a.updatedAt', '<', cursor);
	}
	const notes = await query.execute();

	let nextCursor: Date | null = null;

	if (notes.length > take) {
		const nextItem = notes.pop();
		if (nextItem) {
			nextCursor = nextItem.updatedAt;
		}
	}

	console.timeEnd('notebook');
	return { nextCursor, notes };
}

export function getTags(userId: string) {
	console.time('getTags');
	const tags = db
		.selectFrom('Tag')
		.select(['id', 'name'])
		.where('userId', '=', userId)
		.execute();
	console.timeEnd('getTags');
	return tags;
}

export async function deleteAnnotation(userId: string, id: string) {
	await db
		.deleteFrom('Annotation')
		.where('userId', '=', userId)
		.where('id', '=', id)
		.execute();
}

export const upsertAnnotationSchema = annotationSchema
	.extend({
		id: annotationSchema.shape.id.or(z.array(z.string())),
		relations: z
			.object({
				relatedEntryId: z.number().int(),
				type: z.nativeEnum(RelationType).default('Related'),
			})
			.array()
			.default([]),
		// The array of tags to add to this annotation
		tags: z.number().array().default([]),
	})
	.omit({
		userId: true,
	});

export async function upsertAnnotation({
	ctx,
	input: data,
}: GetCtx<typeof upsertAnnotationSchema>) {
	const { userId } = ctx;
	const { id: _id, relations, tags, ...annotation } = data;
	let ids: Array<string> = [];
	if (!_id) {
		ids = [nanoid()];
	} else {
		ids = Array.isArray(_id) ? _id : [_id];
	}
	await db
		.insertInto('Annotation')
		.values(
			ids.map((id) => ({
				id,
				updatedAt: new Date(),
				...annotation,
				contentData: annotation.contentData
					? json(annotation.contentData)
					: undefined,
				private: annotation.private ? 1 : 0,
				target: annotation.target ? json(annotation.target) : undefined,
				userId,
			})),
		)
		.onDuplicateKeyUpdate({
			...annotation,
			contentData: annotation.contentData
				? json(annotation.contentData)
				: undefined,
			private: annotation.private ? 1 : 0,
			target: annotation.target ? json(annotation.target) : undefined,
			updatedAt: new Date(),
			userId,
		})
		.execute();

	if (relations?.length) {
		const annotations = await db
			.selectFrom('Annotation')
			.where('id', 'in', ids)
			.select(['entryId'])
			.execute();

		const entryIds = annotations.map((a) => a.entryId).filter(Boolean);
		// add relations
		// TODO: remove relations that were present but not in the annotation anymore?
		if (entryIds.length) {
			await db
				.insertInto('Relation')
				.values(
					entryIds.flatMap((entryId) =>
						relations.map((relation) => ({
							entryId,
							id: nanoid(),
							relatedEntryId: relation.relatedEntryId,
							type: relation.type,
							updatedAt: new Date(),
							userId,
						})),
					),
				)
				.ignore()
				.execute();
		}
	}
	if (tags?.length) {
		await db.transaction().execute(async (trx) => {
			await trx
				.deleteFrom('annotation_tag')
				.where('annotationId', 'in', ids)
				.execute();
			return await trx
				.insertInto('annotation_tag')
				.values(
					ids.flatMap((id) =>
						tags.map((tag) => ({
							annotationId: id,
							tagId: tag,
						})),
					),
				)
				.ignore()
				.execute();
		});
	}
	return {
		id: ids.length === 1 ? ids[0] : ids,
	};
}

const noteUpdateInput = z.object({
	id: z.string(),
	input: upsertAnnotationSchema.omit({ id: true }),
});

const noteUpdateInputSchema = noteUpdateInput.or(z.array(noteUpdateInput));

export const s_add_to_collection = z
	.object({
		annotationId: z.string().or(z.string().array()).optional(),
		collectionId: z.number().int(),
		entryId: z.number().int().or(z.number().int().array()).optional(),
	})
	.refine(
		(data) => data.entryId ?? data.annotationId,
		'Must provide either entryId or annotationId',
	);

export async function add_to_collection(
	input: z.infer<typeof s_add_to_collection> & {
		userId: string;
	},
) {
	if (Array.isArray(input.annotationId)) {
		return await db
			.insertInto('CollectionItems')
			.values(
				input.annotationId.map((id) => ({
					annotationId: id,
					collectionId: input.collectionId,
					id: nanoid(),
					updatedAt: new Date(),
				})),
			)
			.execute();
	} else if (Array.isArray(input.entryId)) {
		return await db
			.insertInto('CollectionItems')
			.values(
				input.entryId.map((id) => ({
					collectionId: input.collectionId,
					entryId: id,
					id: nanoid(),
					updatedAt: new Date(),
				})),
			)
			.ignore()
			.execute();
	} else {
		return await db
			.insertInto('CollectionItems')
			.values({
				annotationId: input.annotationId,
				collectionId: input.collectionId,
				entryId: input.entryId,
				id: nanoid(),
				type: input.annotationId ? 'Annotation' : 'Entry',
				updatedAt: new Date(),
			})
			.ignore()
			.execute();
	}
}

// MUTATIONS

const entries_schema = z.object({
	entries: z.array(z.number().int()),
});

export const tagsOnEntrySchema = tagSchema.and(entries_schema);

export const collectionsOnEntrySchema = z
	.object({
		collections: z.array(z.number().int()),
	})
	.and(entries_schema);

export async function set_collections_on_entry({
	collections,
	entries,
	userId,
}: z.infer<typeof collectionsOnEntrySchema> & { userId: string }) {
	// first, delete any existing collections on these entries
	// TODO
	// await db
	// 	.deleteFrom('CollectionItems')
	// 	.where('entryId', 'in', entries)
	// 	.where('collectionId', 'in', collections)
	// 	.execute();
	// const values = entries.flatMap((entryId) =>
	// 	collections.map((collectionId) => ({ entryId, collectionId }))
	// );
	// await db.insertInto('CollectionItems').values([]);
}

export async function set_tags_on_entry({
	entries,
	tags,
	userId,
}: z.input<typeof tagsOnEntrySchema> & { userId: string }) {
	// First, delete all tags on entries
	// await db.deleteFrom("TagOnEntry").where("entryId", "in", entries).execute();

	const tagsToAdd = tags.filter((tag) => !tag.id);
	const tagIds = tags
		.filter((tag) => tag.id)
		.map((tag) => tag.id)
		.filter(Boolean);
	console.log({ tagIds, tagsToAdd });
	if (!tagIds.length) {
		// then delete all existing tags on these entries
		await db.deleteFrom('TagOnEntry').where('entryId', '=', entries).execute();
	}

	if (tagsToAdd.length) {
		console.log('inserting');
		const insertData = await db
			.insertInto('Tag')
			.values(
				tagsToAdd.map((tag) => ({
					name: tag.name,
					userId,
				})),
			)
			.ignore()
			.execute();
		console.log('inserted');
		const newIds = insertData
			.map((row) => Number(row.insertId))
			.filter(Boolean);
		tagIds.push(...newIds);
	}

	const values = entries.flatMap((entryId) =>
		tagIds.map((tagId) => ({ entryId, tagId, userId })),
	);

	if (!values.length) {
		return;
	}

	const q = await db.insertInto('TagOnEntry').values(values).ignore().execute();

	// now delete tags that are no longer there
	await db
		.deleteFrom('TagOnEntry')
		.where('entryId', 'in', entries)
		.where('tagId', 'not in', tagIds)
		.execute();

	// // TODO: use string ids to make this more efficient
	// return message(tagForm, 'Tags added');
}

// move elsewhere
export const entryMetadataSchema = z.object({
	author: z.string().optional(),
	id: z.number().int(),
	title: z.string().optional(),
});

export async function update_metadata_on_entry({
	ctx,
	input,
}: GetCtx<typeof entryMetadataSchema>) {
	const { author, id, title } = input;
	const { userId } = ctx;

	await db
		.insertInto('Bookmark')
		.values({
			author,
			entryId: id,
			title,
			updatedAt: new Date(),
			userId,
			// bookmarked: true,
		})
		.onDuplicateKeyUpdate({
			author,
			title,
		})
		.execute();
}

// TODO cursor pagination and ordering
export async function get_notes_for_tag({
	name,
	userId,
}: {
	name: string;
	userId: string;
}) {
	const query = db
		.selectFrom('annotation_tag as at')
		.innerJoin('Annotation as a', 'a.id', 'at.annotationId')
		.innerJoin('Tag as t', (join) =>
			join.onRef('t.id', '=', 'at.tagId').on('t.name', '=', name),
		)
		.select(annotations.select)
		.select('t.id as tag_id')
		.where('a.userId', '=', userId)
		.where('deleted', 'is', null)
		.orderBy('a.updatedAt', 'desc');

	return await query.execute();
}

export const entry_by_id_schema = z.object({
	id: z.number().int().or(z.string()),
	/** TV Season, only relevant if type === "tv" */
	season: z.number().int().optional(),

	type: typeSchema,
});

export async function entry_by_id({
	ctx: { userId },
	input: { id, season, type },
}: GetCtx<typeof entry_by_id_schema>) {
	let podcast: Awaited<ReturnType<(typeof pindex)['episodeById']>> | null =
		null;

	let query = db
		.selectFrom('Entry')
		.select([
			'id',
			'title',
			'html',
			'text',
			'author',
			'uri',
			'type',
			'image',
			'wordCount',
			'summary',
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
							'Annotation.type',
							'Annotation.parentId',
						])
						.select((eb) =>
							jsonArrayFrom(
								eb
									.selectFrom('annotation_tag as at')
									.innerJoin('Tag as t', 't.id', 'at.tagId')
									.select(['t.id', 't.name', 't.color'])
									.whereRef('at.annotationId', '=', 'Annotation.id'),
							).as('tags'),
						)
						.whereRef('Annotation.entryId', '=', 'Entry.id')
						.where('Annotation.userId', '=', userId)
						.where('Annotation.parentId', 'is', null)
						.where('Annotation.deleted', 'is', null)
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
						.where('c.userId', '=', userId),
				).as('collections'),
				jsonArrayFrom(
					eb
						.selectFrom('EntryHistory as h')
						.innerJoin('auth_user as hu', 'hu.id', 'h.userId')
						.select([
							'h.id',
							'h.createdAt',
							'h.toStatus',
							'h.finished',
							'h.userId',
							'hu.username',
							'hu.avatar',
						])
						.orderBy('h.createdAt', 'asc')
						.whereRef('h.entryId', '=', 'Entry.id')
						.where('h.userId', '=', userId),
				).as('history'),
				jsonArrayFrom(
					eb
						.selectFrom('Relation as r')
						.select(['r.type', 'r.id'])
						.select((eb) =>
							jsonObjectFrom(
								eb
									.selectFrom('Entry as e')
									.whereRef('e.id', '=', 'r.relatedEntryId')
									.select(entrySelect),
							).as('related_entry'),
						)
						.whereRef('r.entryId', '=', 'Entry.id')
						.where('r.userId', '=', userId),
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
									.select(entrySelect),
							).as('related_entry'),
						)
						.whereRef('r.relatedEntryId', '=', 'Entry.id')
						.where('r.userId', '=', userId),
				).as('back_relations'),
				jsonArrayFrom(
					eb
						.selectFrom('TagOnEntry as toe')
						.innerJoin('Tag as t', 't.id', 'toe.tagId')
						.select(['t.id', 't.name'])
						.whereRef('toe.entryId', '=', 'Entry.id')
						.where('toe.userId', '=', userId),
				).as('tags'),
				jsonObjectFrom(
					eb
						.selectFrom('Bookmark as b')
						.select([
							'b.id',
							'b.status',
							'b.createdAt',
							'b.bookmarked',
							'b.author',
							'b.title',
						])
						// .select(eb => [jsonObjectFrom(
						//     eb.selectFrom('auth_user as u').select(['u.username', 'u.id']).whereRef('u.id', '=', 'b.userId')
						// )]).as('user')
						.select((eb) => [
							jsonObjectFrom(
								eb
									.selectFrom('auth_user as u')
									.select(['u.id', 'u.username', 'u.avatar'])
									.whereRef('u.id', '=', 'b.userId'),
							).as('user'),
						])
						.whereRef('b.entryId', '=', 'Entry.id')
						.where('b.userId', '=', userId),
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
						.where('i.userId', '=', userId)
						.limit(1),
				).as('interaction'),
			]),
		)
		.$if(type === 'tweet', (qb) => qb.select(['Entry.original as tweet']));
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
			if (podcastIndexId) {
				query = query.where('Entry.podcastIndexId', '=', +podcastIndexId);
				podcast = await pindex.episodeById(+podcastIndexId);
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

	const entry = await query.executeTakeFirst();

	console.dir({ entry }, { depth: null });

	return {
		album: type === 'album' ? await spotify.album(id.toString()) : null,
		book: type === 'book' ? await books.get(id.toString()) : null,
		entry,
		extras: {
			season:
				type === 'tv' && typeof season === 'number'
					? await tmdb.tv.season(+id, season)
					: null,
		},
		movie: type === 'movie' ? await tmdb.movie.details(+id) : null,
		podcast,
		tv: type === 'tv' ? await tmdb.tv.details(+id) : null,
		type,
	};
}

export type FullEntryDetail = Awaited<ReturnType<typeof entry_by_id>>;
export type EntryDetail = NonNullable<FullEntryDetail['entry']>;
export type EntryInteraction = NonNullable<EntryDetail['interaction']>;
export type EntryAnnotation = NonNullable<
	NonNullable<FullEntryDetail['entry']>['annotations']
>[number];

function validate_entry_type<TEntry extends { tweet?: unknown }>(
	entry: TEntry,
): TEntry & {
	tweet: Tweet | undefined;
} {
	let tweet: Tweet | undefined = undefined;
	if (entry.tweet) {
		const { data, problems } = tweet_types.tweet(entry.tweet);
		if (data) {
			tweet = data;
		}
	}
	entry.tweet = tweet;
	return entry as TEntry & {
		tweet: Tweet | undefined;
	};
}

// same type as get_library
export const countLibrarySchema = z.object({
	filter: z.object({
		search: z.string().optional(),
		type: z.nativeEnum(DocumentType).optional(),
	}),
	status: z.nativeEnum(Status).nullable(),
});

export async function count_library({
	ctx,
	input,
}: GetCtx<typeof countLibrarySchema>) {
	const { userId } = ctx;
	const { filter, status } = input;
	let query = db
		.selectFrom('Bookmark as b')
		.innerJoin('Entry as e', 'e.id', 'b.entryId')
		.where('b.userId', '=', userId)
		.select(({ fn, ref }) => [fn.count('e.id').as('count')]);
	if (status) {
		query = query.where('b.status', '=', status);
	}
	if (filter.type) {
		query = query.where('e.type', '=', filter.type);
	}
	if (filter.search) {
		query = query.where('e.title', 'like', `%${filter.search}%`);
	}

	const { count } = await query.executeTakeFirstOrThrow();
	return {
		count: Number(count),
	};
}

export const saveToLibrarySchema = librarySchema.and(
	z.object({
		historyId: z.string().optional(),
		status: z.nativeEnum(Status).default('Backlog'),
	}),
);

export type SaveToLibrarySchema = z.input<typeof saveToLibrarySchema>;

/**
 * Given an entry id (or spotify/gbooks/tmdb/etc id), saves it to the library
 */
export async function save_to_library({
	ctx,
	input,
}: GetCtx<typeof saveToLibrarySchema>) {
	const { status, type } = input;
	let { entryId } = input;
	if (!entryId) {
		// then we need to create the entry
		const { id } = await createEntry(input);
		entryId = id;
	}

	const sort_order = await getFirstBookmarkSort(ctx.userId);

	// save bookmark history

	await db.transaction().execute(async (trx) => {
		const bookmark = await trx
			.insertInto('Bookmark')
			.values({
				entryId,
				sort_order,
				status,
				updatedAt: new Date(),
				userId: ctx.userId,
			})
			.onDuplicateKeyUpdate({
				status,
			})
			.executeTakeFirst();

		// save bookmark history (tho maybe this should be entry hsitory?)
		return await trx
			.insertInto('EntryHistory')
			.values({
				entryId: entryId!,
				id: input.historyId ?? nanoid(),
				toStatus: status ?? 'Backlog',
				updatedAt: new Date(),
				userId: ctx.userId,
			})
			.onDuplicateKeyUpdate({
				toStatus: status ?? 'Backlog',
			})
			.execute();
	});
}

/**
 * Function to get media info and save it as an entry.
 * @param input Media ID Input
 * @returns New Entry
 */
export async function createEntry(input: z.input<typeof entryIdAndTypeSchema>) {
	// then we need to create the entry
	let insertable: Insertable<Entry> = {
		updatedAt: new Date(),
		// ...data
	};

	const { type } = input;

	switch (input.type) {
		case 'tv':
		case 'movie': {
			if (type === 'tv') {
				const tv = await tmdb.tv.details(input.tmdbId);
				insertable = {
					...insertable,
					author: tv.created_by.map((val) => val.name).join(', '),
					image: tmdb.media(tv.poster_path),
					published: tv.first_air_date,
					text: tv.overview,
					title: tv.name,
					tmdbId: tv.id,
					type: 'tv',
					uri: `tmdb:tv:${tv.id}`,
				};
			} else {
				const movie = await tmdb.movie.details(input.tmdbId);
				insertable = {
					...insertable,
					author: movie.credits.crew.find((c) => c.job === 'Director')?.name,
					html: movie.overview,
					image: tmdb.media(movie.poster_path),
					published: movie.release_date,
					title: movie.title,
					tmdbId: movie.id,
					type: 'movie',
					uri: `tmdb:${movie.id}`,
				};
			}
			break;
		}
		case 'book': {
			const book = await books.get(input.googleBooksId);
			console.log({ book });
			let image = book.volumeInfo.imageLinks?.thumbnail;
			if (image) {
				const u = new URL(image);
				u.searchParams.delete('edge');
				image = u.toString();
			}
			const fiction = book.volumeInfo.categories?.some((category) =>
				category.startsWith('Fiction'),
			);
			insertable = {
				...insertable,
				author: book.volumeInfo.authors?.join(', '),
				book_genre: fiction ? 'Fiction' : 'NonFiction',
				genres: book.volumeInfo.categories?.join(', '),
				googleBooksId: book.id,
				html: book.volumeInfo.description,
				image,
				pageCount: book.volumeInfo.pageCount,
				published: book.volumeInfo.publishedDate,
				publisher: book.volumeInfo.publisher,
				title: book.volumeInfo.title,
				type: 'book',
				uri: `isbn:${book.volumeInfo.industryIdentifiers?.find(
					(i) => i.type === 'ISBN_13',
				)?.identifier}`,
			};
			break;
		}
		case 'podcast': {
			//todo
			const { episode } = await pindex.episodeById(
				Number(input.podcastIndexId),
			);
			insertable = {
				...insertable,
				image: episode.image || episode.feedImage,
				podcastIndexId: episode.id,
				published: new Date(episode.datePublished * 1000),
				text: episode.description,
				title: episode.title,
				type: 'podcast',
				uri: episode.enclosureUrl,
			};
			break;
		}
		case 'album': {
			const album = await spotify.album(input.spotifyId);
			insertable = {
				...insertable,
				author: album.artists.map((a) => a.name).join(', '),
				image: album.images[0]?.url,
				published: new Date(album.release_date),
				spotifyId: album.id,
				title: album.name,
				type: 'album',
				uri: `spotify:album:${album.id}`,
			};
			break;
		}
		default: {
			// TODO
			// input.type;
		}
	}

	const entry = await db
		.insertInto('Entry')
		.values(insertable)
		.ignore()
		.executeTakeFirstOrThrow();
	const entryId = Number(entry.insertId);
	if (entryId) {
		return {
			id: entryId,
			type,
			...insertable,
		};
	} else {
		let query = db.selectFrom('Entry as e').select(entrySelect);
		if (type === 'tv' || type === 'movie') {
			query = query.where('tmdbId', '=', input.tmdbId);
		} else if (type === 'book') {
			query = query.where('googleBooksId', '=', input.googleBooksId);
		} else if (type === 'podcast') {
			query = query.where('podcastIndexId', '=', input.podcastIndexId);
		} else if (type === 'album') {
			query = query.where('spotifyId', '=', input.spotifyId);
		}
		const entry = await query.executeTakeFirstOrThrow();
		return entry;
	}
}

// this should be rolled into one big "extras" query maybe
export async function get_authors({
	ctx: { userId },
}: {
	ctx: {
		userId: string;
	};
}) {
	const authors = await db
		.selectFrom('Bookmark as b')
		.innerJoin('Entry as e', 'e.id', 'b.entryId')
		.where('b.userId', '=', userId)
		// .where('e.author', 'is not', null)
		// REVIEW: do we want to only grab bookmark author if both exist?
		.where(({ eb, fn }) =>
			eb(fn.coalesce('b.author', 'e.author'), 'is not', null),
		)
		.where(({ eb, fn }) =>
			eb(fn.coalesce('b.author', 'e.author'), 'is not', null),
		)
		.where(sql`TRIM(COALESCE(b.author,e.author)) <> ''`)
		.select((eb) => eb.fn.coalesce('b.author', 'e.author').as('author'))
		.orderBy('author', 'asc')
		.distinct()
		.$narrowType<{ author: string }>()
		.execute();

	return authors.map((a) => a.author);
}

export const updateTagSchema = z.object({
	data: z
		.object({
			color: z.string(),
			name: z.string(),
			// TODO description etc.
		})
		.partial(),
	id: z.number(),
});

export type UpdateTagInput = z.input<typeof updateTagSchema>;

export async function updateTag({
	ctx,
	input,
}: GetCtx<typeof updateTagSchema>) {
	await db
		.updateTable('Tag')
		.set(input.data)
		.where('id', '=', input.id)
		.where('userId', '=', ctx.userId)
		.execute();
}

export const createTagSchema = z.object({
	// The color of the tag. If none is provided, the default color will be used.
	color: z.string().optional(),

	// The name of the tag
	name: z.string(),
});

type CreateTagInput = z.input<typeof createTagSchema>;

export async function createTag({
	ctx,
	input,
}: GetCtx<typeof createTagSchema>) {
	const tag = await db
		.insertInto('Tag')
		.values({
			...input,
			userId: ctx.userId,
		})
		.ignore()
		.executeTakeFirstOrThrow();

	return {
		id: Number(tag.insertId),
	};
}

export const convertToSchema = z
	.object({
		// The entry ID to convert
		id: z.number(),
		// The type to convert to
	})
	.and(mediaIdSchema);

export async function convertTo({
	ctx,
	input,
}: GetCtx<typeof convertToSchema>) {
	const { id, type } = input;
	const { userId } = ctx;

	// More to flesh out here...
	// const entry = await db.selectFrom('Entry').where('id', '=', id).executeTakeFirstOrThrow();

	let newEntry:
		| {
				googleBooksId?: string | null;
				id: number;
				podcastIndexId?: number | null;
				spotifyId?: string | null;
				tmdbId?: number | null;
				type: DocumentType;
		  }
		| undefined = undefined;

	if (type === 'book') {
		// find book stuff
		newEntry = await createEntry(input);
	}

	if (!newEntry) {
		throw new Error("Couldn't convert");
	}

	// TODO: this transaction is unwieldly, and the delete part should be handled by qstash asynchronously
	await db.transaction().execute(async (trx) => {
		if (!newEntry) {
			return;
		}
		console.time('convert transaction');
		await trx
			.updateTable('TagOnEntry')
			.set({ entryId: newEntry.id })
			.where('entryId', '=', id)
			.where('userId', '=', userId)
			.execute();
		// now relations
		await trx
			.updateTable('Relation')
			.set({ entryId: newEntry.id })
			.where('entryId', '=', id)
			.where('userId', '=', userId)
			.execute();
		// now annotations
		await trx
			.updateTable('Annotation')
			.set({ entryId: newEntry.id })
			.where('entryId', '=', id)
			.where('userId', '=', userId)
			.execute();

		await trx
			.updateTable('EntryInteraction')
			.set({ entryId: newEntry.id })
			.where('entryId', '=', id)
			.where('userId', '=', userId)
			.execute();

		await trx
			.updateTable('CollectionItems as ci')
			// .innerJoin('Collection as c', 'c.id', 'ci.collectionId')
			.set({ entryId: newEntry.id })
			.where('entryId', '=', id)
			// .where('c.userId', '=', userId)
			.where(({ and, exists, selectFrom }) =>
				and([
					exists(
						selectFrom('Collection as c')
							.select('c.id')
							.whereRef('c.id', '=', 'ci.collectionId')
							.where('c.userId', '=', userId),
					),
				]),
			)
			.execute();

		await trx
			.updateTable('Favorite')
			.set({ entryId: newEntry.id })
			.where('entryId', '=', id)
			.where('userId', '=', userId)
			.execute();

		// delete old entry if no bookmarks
		await trx
			.selectFrom('Bookmark')
			.where('entryId', '=', id)
			.select('id')
			.execute()
			.then(async (rows) => {
				if (!rows.length) {
					await trx.deleteFrom('Entry').where('id', '=', id).execute();
				}
			});

		// assign bookmark to new entry
		const final = await trx
			.updateTable('Bookmark')
			.set({ entryId: newEntry.id })
			.where('entryId', '=', id)
			.where('userId', '=', userId)
			.execute();

		console.timeEnd('convert transaction');
		return final;
	});

	return newEntry;
}

export const notesInputOrderAndCursorSchema = z.union([
	z.object({
		cursor: z.coerce.date().optional(),
		dir: z.enum(['asc', 'desc']).default('desc'),
		orderBy: z.enum(['updatedAt', 'createdAt']).default('createdAt'),
	}),
	z.object({
		cursor: z
			.object({
				createdAt: z.coerce.date(),
				title: z.string().nullable(),
			})
			.optional(),
		dir: z.enum(['asc', 'desc']).default('asc'),
		orderBy: z.literal('name'),
	}),
]);

export const notesInputSchema = z
	.object({
		filter: noteFilterSchema.optional(),
		includeArchived: z.boolean().optional(),
		// Number of notes to return. Defaults to 50.
		take: z.number().default(50),
	})
	.deepPartial()
	.and(notesInputOrderAndCursorSchema);

export type NotesInput = z.input<typeof notesInputSchema>;

function noteTags(
	eb: ExpressionBuilder<
		DB & {
			a: Annotation;
		},
		'a'
	>,
) {
	return jsonArrayFrom(
		eb
			.selectFrom('annotation_tag as at')
			.innerJoin('Tag as t', 't.id', 'at.tagId')
			.select(['t.id', 't.name', 't.color'])
			.whereRef('at.annotationId', '=', 'a.id'),
	).as('tags');
}
function notePin(
	eb: ExpressionBuilder<
		DB & {
			a: Annotation;
		},
		'a'
	>,
) {
	return jsonObjectFrom(
		eb
			.selectFrom('Favorite as pin')
			.select(['pin.id'])
			.whereRef('pin.annotationId', '=', 'a.id'),
	).as('pin');
}

export async function notes({ ctx, input }: GetCtx<typeof notesInputSchema>) {
	const { cursor, dir, filter, includeArchived, orderBy } = input;

	const take = input.take || 50;

	// TODO: should we filter out replies?

	let query = db
		.selectFrom('Annotation as a')
		.select(annotations.select)
		.$narrowType<{
			contentData: JSONContent;
		}>()
		.select(withEntry)
		.select((eb) => noteTags(eb))
		.select((eb) => notePin(eb))
		// this should always be on there - right?
		.where('a.userId', '=', ctx.userId)
		// Get 1 more to get cursor
		.limit(take + 1);

	if (orderBy === 'createdAt' || !orderBy) {
		const _dir = dir ?? 'desc';
		query = query.orderBy('a.createdAt', _dir);
		if (cursor) {
			query = query.where('a.createdAt', _dir === 'desc' ? '<' : '>', cursor);
		}
	} else if (orderBy === 'updatedAt') {
		const _dir = dir ?? 'desc';
		query = query.orderBy('a.updatedAt', _dir);
		if (cursor) {
			query = query.where('a.updatedAt', _dir === 'desc' ? '<' : '>', cursor);
		}
	} else if (orderBy === 'name') {
		const _dir = dir ?? 'asc';
		query = query.orderBy('a.title', _dir).orderBy('a.createdAt', _dir);
		if (cursor) {
			query = query.where((eb) =>
				eb.or([
					eb('a.title', _dir === 'asc' ? '>' : '<', cursor.title),
					eb('a.title', '=', cursor.title).and(
						'a.createdAt',
						_dir === 'asc' ? '>' : '<',
						cursor.createdAt,
					),
				]),
			);
		}
	} else {
		orderBy satisfies never;
	}

	if (filter) {
		const { content, ...restFilter } = filter;
		query = query.where((eb) => applyFilter(eb, restFilter));
		if (content) {
			query = query.where('a.contentData', 'is not', null);
			query = query.where(
				sql`LOWER(JSON_UNQUOTE(JSON_EXTRACT(a.contentData, '$**.text'))) LIKE '%${sql.raw(
					content,
				)}%'`,
			);
		}
	}

	if (!includeArchived) {
		query = query.where('a.deleted', 'is', null);
	}
	const notes = await query.execute();
	let nextCursor: typeof cursor | undefined = undefined;
	if (notes.length > take) {
		const nextItem = notes.pop();
		if (nextItem) {
			if (orderBy === 'createdAt' || orderBy === 'updatedAt') {
				nextCursor = nextItem[orderBy];
			} else if (orderBy === 'name') {
				nextCursor = {
					createdAt: nextItem.createdAt,
					title: nextItem.title,
				};
			} else {
				// orderBy satisfies never;
			}
		}
	}
	return {
		nextCursor,
		notes,
		// todo: nextCursor
	};
}

export type NotesResponse = Awaited<ReturnType<typeof notes>>;
export type Notes = Awaited<ReturnType<typeof notes>>['notes'];
export type Note = Notes[number];

export async function note({
	ctx,
	input,
}: GetCtx<typeof idSchema>): Promise<Note> {
	const { id } = input;

	const query = db
		.selectFrom('Annotation as a')
		.select(annotations.select)
		.$narrowType<{
			contentData: JSONContent;
		}>()
		.select(withEntry)
		.select((eb) => noteTags(eb))
		.select((eb) => notePin(eb))
		.where('a.id', '=', id)
		.where('a.userId', '=', ctx.userId)
		.executeTakeFirstOrThrow();

	return query;
}

const _createFavoriteSchema = z
	.object({
		annotationId: z.string().nullish(),
		collectionId: z.number().nullish(),
		entryId: z.number().nullish(),
		feedId: z.number().nullish(),
		//
		folderName: z.string().nullish(),

		//
		id: z.string(),

		parentId: z.string().nullish(),

		smartListId: z.number().nullish(),

		sortOrder: z.number().nullish(),

		tagId: z.number().nullish(),
	})
	.partial();

export const createFavoriteSchema = _createFavoriteSchema.or(
	z.array(_createFavoriteSchema),
);

// Technically "upsert"
export async function createFavorite({
	ctx,
	input,
}: GetCtx<typeof createFavoriteSchema>) {
	const { userId } = ctx;
	const dataToInsert = (Array.isArray(input) ? input : [input]).map((item) => {
		const id = item.id ?? nanoid();
		return {
			...item,
			id,
			type: item.folderName ? 'FOLDER' : 'FAVORITE',
			updatedAt: new Date(),
			userId,
		} as const;
	});

	const result = await db.insertInto('Favorite').values(dataToInsert).execute();

	const ids = dataToInsert.map((item) => item.id);
	return {
		id: ids.length === 1 ? ids[0] : ids,
	};
}

export const updateFavoriteSchema = z.object({
	data: z
		.object({
			folderName: z.string().nullish(),
			parentId: z.string().nullish(),
			sortOrder: z.number().nullish(),
		})
		.partial(),
	id: z.string(),
});

export async function updateFavorite({
	ctx,
	input,
}: GetCtx<typeof updateFavoriteSchema>) {
	const { userId } = ctx;
	const { data, id } = input;
	await db
		.updateTable('Favorite')
		.set(data)
		.where('id', '=', id)
		.where('userId', '=', userId)
		.execute();
}

// .onDuplicateKeyUpdate({
//     updatedAt: new Date(),
//     folderName: input.folderName,
//     sortOrder: input.sortOrder,
//     parentId: input.parentId
// })

export const favoriteSelect = [
	'f.id',
	'f.parentId',
	'f.type',
	'f.createdAt',
	'f.updatedAt',
	'f.folderName',
	'f.sortOrder',
] as const satisfies SelectArg<
	DB & { f: Favorite },
	'f',
	SelectExpression<DB & { f: Favorite }, 'f'>
>;

const favorite2Select = () =>
	[
		'f.id',
		'f.parentId',
		'f.type',
		'f.createdAt',
		'f.updatedAt',
		'f.folderName',
		'f.sortOrder',
	] as const satisfies SelectArg<
		DB & { f: Favorite },
		'f',
		SelectExpression<DB & { f: Favorite }, 'f'>
	>;

function fSelect<const TAlias extends string>(alias: TAlias) {
	return [
		`${alias}.id`,
		`${alias}.parentId`,
		`${alias}.type`,
		`${alias}.createdAt`,
		`${alias}.updatedAt`,
		`${alias}.folderName`,
		`${alias}.sortOrder`,
	] as const;
}

export function favoriteContent(
	eb: ExpressionBuilder<
		DB & {
			f: Favorite;
		},
		'f'
	>,
	alias = 'f',
) {
	// REVIEW - have to use as any here to allow use of alias. Shouldn't effect overall type-safety of output.
	return [
		jsonObjectFrom(
			eb
				.selectFrom('SmartList as v')
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.whereRef('v.id', '=', `${alias}.smartListId` as any)
				.select(['v.name', 'v.id']),
		).as('view'),
		jsonObjectFrom(
			eb
				.selectFrom('Collection as c')
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.whereRef('c.id', '=', `${alias}.collectionId` as any)
				.select(['c.name', 'c.id']),
		).as('collection'),
		jsonObjectFrom(
			eb
				.selectFrom('Tag as t')
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.whereRef('t.id', '=', `${alias}.tagId` as any)
				.select(['t.name', 't.id', 't.color']),
		).as('tag'),
		jsonObjectFrom(
			eb
				.selectFrom('Annotation as a')
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.whereRef('a.id', '=', `${alias}.annotationId` as any)
				// TODO: grabn more info?
				.select(['a.title', 'a.color', 'a.icon', 'a.id']),
		).as('note'),
		jsonObjectFrom(
			eb
				.selectFrom('Entry as e')
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.whereRef('e.id', '=', `${alias}.entryId` as any)
				.leftJoin('Bookmark as b', 'b.entryId', 'e.id')
				// TODO: grabn more info?
				.select(entrySelect)
				.select('b.title as bookmarkTitle'),
		).as('entry'),
	];
}

function favoriteChildren(
	eb: ExpressionBuilder<
		DB & {
			f: Favorite;
		},
		'f'
	>,
	alias = 'f',
) {
	return jsonArrayFrom(
		eb
			.selectFrom('Favorite as f2')
			.whereRef(
				'f2.parentId',
				'=',
				`${alias}.id` as ReferenceExpression<
					DB & { f: Favorite } & { f2: Favorite },
					'f' | 'f2'
				>,
			)
			.select(fSelect('f2'))
			.select((eb) => favoriteContent(eb, 'f2'))
			.orderBy('f2.sortOrder', 'asc')
			.orderBy('f2.createdAt', 'desc'),
	).as('children');
}

function compilePinsQuery(userId: string) {
	return (
		db
			.selectFrom('Favorite as f')
			.where('f.userId', '=', userId)
			.where('f.parentId', 'is', null)
			.select(favoriteSelect)
			.select(favoriteContent)
			.select(favoriteChildren)

			// .select(eb =>)
			.orderBy('f.sortOrder', 'asc')
			.orderBy('f.createdAt', 'desc')
			.compile()
	);
}

type RawPin = InferResult<ReturnType<typeof compilePinsQuery>>[number];

export async function pins({ ctx }: Ctx) {
	const pins = await db.executeQuery(compilePinsQuery(ctx.userId));
	return pins.rows as Array<SetOptional<RawPin, 'children'>>;
}

export type Pins = Awaited<ReturnType<typeof pins>>;
export type Pin = Pins[number];
