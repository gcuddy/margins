import { annotationSchema, type AnnotationSchema } from '$lib/annotation';
import pindex from '$lib/api/pindex';
import { Tweet, tweet_types } from '$lib/api/twitter';
import { db, json } from '$lib/db';
import { annotations, entrySelect, getFirstBookmarkSort, withEntry } from '$lib/db/selects';
import {
	bookmarkSchema,
	tagSchema,
	updateBookmarkSchema as form_updateBookmarkSchema,
	librarySchema
} from '$lib/features/entries/forms';
import { nanoid } from '$lib/nanoid';
import { BookmarkSchema } from '$lib/prisma/zod-prisma';
import { interactionSchema, idSchema } from '$lib/schemas';
import { typeSchema } from '$lib/types';
import { AnnotationType, DocumentType, RelationType, Status, Tag } from '@prisma/client';
import { sql } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { tmdb } from '$lib/api/tmdb';
import { books } from '$lib/api/gbook';
import spotify from '$lib/api/spotify';
import type { ExpressionBuilder, Insertable, SelectQueryBuilder } from 'kysely';
import type { Bookmark, DB, Entry, Annotation } from '$lib/prisma/kysely/types';
import type { Entry as PrismaEntry } from '@prisma/client';
import type { FilterLibrarySchema } from '$lib/schemas/library';
import type { JSONContent } from '@tiptap/core';

type GetCtx<T extends z.ZodTypeAny> = {
	input: z.input<T>;
	ctx: {
		userId: string;
	};
};

export const mediaIdSchema = z.union([
	z.object({
		tmdbId: z.number().int(),
		type: z.enum(['movie', 'tv'])
	}),
	z.object({
		spotifyId: z.string(),
		type: z.enum(['album'])
	}),
	z.object({
		googleBooksId: z.string(),
		type: z.enum(['book'])
	}),
	z.object({
		podcastIndexId: z.number(),
		type: z.enum(['podcast'])
	})
]);

const entrySchema = z.object({
	entryId: z.number().int(),
	type: z.enum(['article', 'video', 'pdf', 'tweet', 'board_game'])
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
			'podcastIndexId'
		])
		.limit(10)
		.orderBy('createdAt', 'desc')
		.execute();
	return entries;
}

const id_schema = z.coerce.number().or(z.coerce.number().array());

const id_or_entryid = z.union([z.object({ entryId: id_schema }), z.object({ id: id_schema })]);

export const updateBookmarkSchema = id_or_entryid.and(
	z.object({
		data: BookmarkSchema.partial().omit({ id: true, userId: true }).extend({
			// private: number (0 or 1)
			private: z.number().int().optional(),
			is_read: z.number().int().optional(),
			bookmarked: z.number().int().optional()
		})
	})
);

export type UpdateBookmarkSchema = z.input<typeof updateBookmarkSchema>;

export async function updateBookmark(
	variables: UpdateBookmarkSchema & {
		userId: string;
	}
) {
	const { data, userId } = variables;
	if ('id' in variables) {
		let bookmarks = db.updateTable('Bookmark').set(data).where('userId', '=', userId);
		const { id } = variables;
		if (Array.isArray(id)) {
			bookmarks = bookmarks.where('id', 'in', id);
		} else {
			bookmarks = bookmarks.where('id', '=', id);
		}
		return await bookmarks.execute();
	} else {
		const { entryId } = variables;
		const entryIds = Array.isArray(entryId) ? entryId : [entryId];
		let bookmarks = db
			.insertInto('Bookmark')
			.values(
				entryIds.map((entryId) => ({
					updatedAt: new Date(),
					userId,
					entryId,
					bookmarked: 0,
					...data
				}))
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
	cursor: z.coerce.date().optional()
});

export type GetNotebookSchema = z.infer<typeof getNotebookSchema>;

export async function getNotebook({ userId, cursor }: GetNotebookSchema & { userId: string }) {
	console.time('notebook');
	const take = 25;
	let query = db
		.selectFrom('Annotation as a')
		.innerJoin('Entry as e', 'a.entryId', 'e.id')
		.select(annotations.select)
		.select(withEntry)
		.where('userId', '=', userId)
		.where(({ or, cmpr }) => or([cmpr('a.type', '=', 'annotation'), cmpr('a.type', '=', 'note')]))
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
	return { notes, nextCursor };
}

export function getTags(userId: string) {
	console.time('getTags');
	const tags = db.selectFrom('Tag').select(['id', 'name']).where('userId', '=', userId).execute();
	console.timeEnd('getTags');
	return tags;
}

export async function deleteAnnotation(userId: string, id: string) {
	await db.deleteFrom('Annotation').where('userId', '=', userId).where('id', '=', id).execute();
}

export const upsertAnnotationSchema = annotationSchema.extend({
	relations: z
		.object({
			relatedEntryId: z.number().int(),
			type: z.nativeEnum(RelationType).default('Related')
		})
		.array()
		.default([]),
	// The array of tags to add to this annotation
	tags: z.number().array().default([])
});

export async function upsertAnnotation(data: z.input<typeof upsertAnnotationSchema>) {
	const { id: _id, relations, tags, ...annotation } = data;
	let id = _id;
	if (!id) {
		id = nanoid();
	}
	console.log({ id, annotation });
	await db
		.insertInto('Annotation')
		.values({
			id,
			updatedAt: new Date(),
			...annotation,
			private: annotation.private ? 1 : 0,
			target: annotation.target ? json(annotation.target) : undefined,
			contentData: annotation.contentData ? json(annotation.contentData) : undefined
		})
		.onDuplicateKeyUpdate({
			...annotation,
            updatedAt: new Date(),
			private: annotation.private ? 1 : 0,
			target: annotation.target ? json(annotation.target) : undefined,
			contentData: annotation.contentData ? json(annotation.contentData) : undefined
		})
		.execute();

	if (relations?.length) {
		const { entryId } = await db
			.selectFrom('Annotation')
			.where('id', '=', id)
			.select(['entryId'])
			.executeTakeFirstOrThrow();
		// add relations
		// TODO: remove relations that were present but not in the annotation anymore?
		if (entryId) {
			await db
				.insertInto('Relation')
				.values(
					relations.map((relation) => ({
						entryId,
						relatedEntryId: relation.relatedEntryId,
						id: nanoid(),
						updatedAt: new Date(),
						userId: data.userId,
						type: relation.type
					}))
				)
				.ignore()
				.execute();
		}
	}
	if (tags?.length) {
		await db.transaction().execute(async (trx) => {
			await trx.deleteFrom('annotation_tag').where('annotationId', '=', id!).execute();
			return await trx
				.insertInto('annotation_tag')
				.values(
					tags.map((tag) => ({
						annotationId: id!,
						tagId: tag
					}))
				)
				.ignore()
				.execute();
		});
	}
	return {
		id
	};
}

export const s_add_to_collection = z
	.object({
		entryId: z.number().int().or(z.number().int().array()).optional(),
		collectionId: z.number().int(),
		annotationId: z.string().or(z.string().array()).optional()
	})
	.refine(
		(data) => data.entryId || data.annotationId,
		'Must provide either entryId or annotationId'
	);

export async function add_to_collection(
	input: z.infer<typeof s_add_to_collection> & {
		userId: string;
	}
) {
	if (Array.isArray(input.annotationId)) {
		return await db
			.insertInto('CollectionItems')
			.values(
				input.annotationId.map((id) => ({
					collectionId: input.collectionId,
					annotationId: id,
					id: nanoid(),
					updatedAt: new Date()
				}))
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
					updatedAt: new Date()
				}))
			)
			.execute();
	} else {
		return await db
			.insertInto('CollectionItems')
			.values({
				entryId: input.entryId,
				annotationId: input.annotationId,
				collectionId: input.collectionId,
				id: nanoid(),
				updatedAt: new Date()
			})
			.execute();
	}
}

// MUTATIONS

const entries_schema = z.object({
	entries: z.array(z.number().int())
});

export const tagsOnEntrySchema = tagSchema.and(entries_schema);

export const collectionsOnEntrySchema = z
	.object({
		collections: z.array(z.number().int())
	})
	.and(entries_schema);

export async function set_collections_on_entry({
	collections,
	entries,
	userId
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
	tags,
	entries,
	userId
}: z.input<typeof tagsOnEntrySchema> & { userId: string }) {
	// First, delete all tags on entries
	// await db.deleteFrom("TagOnEntry").where("entryId", "in", entries).execute();

	const tagsToAdd = tags.filter((tag) => !tag.id);
	const tagIds = tags
		.filter((tag) => tag.id)
		.map((tag) => tag.id)
		.filter(Boolean);
	console.log({ tagsToAdd, tagIds });
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
					userId
				}))
			)
			.ignore()
			.execute();
		console.log('inserted');
		const newIds = insertData.map((row) => Number(row.insertId)).filter(Boolean);
		tagIds.push(...newIds);
	}

	const values = entries.flatMap((entryId) => tagIds.map((tagId) => ({ entryId, tagId, userId })));

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
	id: z.number().int(),
	title: z.string().optional(),
	author: z.string().optional()
});

export async function update_metadata_on_entry({ input, ctx }: GetCtx<typeof entryMetadataSchema>) {
	const { id, title, author } = input;
	const { userId } = ctx;

	await db
		.insertInto('Bookmark')
		.values({
			userId,
			entryId: id,
			title,
			author,
			updatedAt: new Date()
			// bookmarked: true,
		})
		.onDuplicateKeyUpdate({
			title,
			author
		})
		.execute();
}

// TODO cursor pagination and ordering
export async function get_notes_for_tag({ name, userId }: { name: string; userId: string }) {
	let query = db
		.selectFrom('annotation_tag as at')
		.innerJoin('Annotation as a', 'a.id', 'at.annotationId')
		.innerJoin('Tag as t', (join) => join.onRef('t.id', '=', 'at.tagId').on('t.name', '=', name))
		.select(annotations.select)
		.select('t.id as tag_id')
		.where('a.userId', '=', userId)
		.where('deleted', 'is', null)
		.orderBy('a.updatedAt', 'desc');

	return await query.execute();
}

export const entry_by_id_schema = z.object({
	id: z.number().int().or(z.string()),
	type: typeSchema,
	/** TV Season, only relevant if type === "tv" */
	season: z.number().int().optional()
});

export async function entry_by_id({
	input: { id, type, season },
	ctx: { userId }
}: GetCtx<typeof entry_by_id_schema>) {
	console.time('entry');

	let podcast: Awaited<ReturnType<(typeof pindex)['episodeById']>> | null = null;

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
							'Annotation.exact',
							'Annotation.type',
							'Annotation.parentId'
						])
						.select((eb) =>
							jsonArrayFrom(
								eb
									.selectFrom('annotation_tag as at')
									.innerJoin('Tag as t', 't.id', 'at.tagId')
									.select(['t.id', 't.name', 't.color'])
									.whereRef('at.annotationId', '=', 'Annotation.id')
							).as('tags')
						)
						.whereRef('Annotation.entryId', '=', 'Entry.id')
						.where('Annotation.userId', '=', userId!)
						.where('Annotation.parentId', 'is', null)
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
						.selectFrom('Bookmark as b')
						.select(['b.id', 'b.status', 'b.createdAt', 'b.bookmarked', 'b.author', 'b.title'])
						// .select(eb => [jsonObjectFrom(
						//     eb.selectFrom('auth_user as u').select(['u.username', 'u.id']).whereRef('u.id', '=', 'b.userId')
						// )]).as('user')
						.select((eb) => [
							jsonObjectFrom(
								eb
									.selectFrom('auth_user as u')
									.select(['u.id', 'u.username', 'u.avatar'])
									.whereRef('u.id', '=', 'b.userId')
							).as('user')
						])
						.whereRef('b.entryId', '=', 'Entry.id')
						.where('b.userId', '=', userId!)
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
				podcast = await pindex.episodeById(+podcastIndexId);
				console.log({ podcast });
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

	console.timeEnd('entry');

	const tagForm = superValidate(
		{
			tags: entry?.tags
		},
		tagSchema,
		{ id: 'tag' }
	);

	const updateBookmarkForm = superValidate(entry?.bookmark, form_updateBookmarkSchema, {
		id: 'update'
	});

	const annotationForm = superValidate(
		{
			entryId: entry?.id,
			userId
		},
		annotationSchema,
		{ id: 'annotation' }
	);

	const bookmarkForm = superValidate(
		{
			id: entry?.bookmark?.id,
			entryId: entry?.id,
			tmdbId: type === 'movie' || type === 'tv' ? +id : undefined,
			googleBooksId: type === 'book' ? id.toString() : undefined,
			podcastIndexId:
				type === 'podcast' && id.toString().startsWith('p')
					? Number(id.toString().slice(1))
					: undefined,
			spotifyId: type === 'album' ? id.toString() : undefined,
			type
		},
		bookmarkSchema,
		{ id: 'bookmark' }
	);

	// TODO: multiple interactions support
	const interactionForm = superValidate(
		{
			...entry?.interaction,
			entryId: entry?.id
		},
		interactionSchema,
		{ id: 'interaction' }
	);

	return {
		// tagForm,
		// updateBookmarkForm,
		// bookmarkForm,
		// annotationForm,
		// interactionForm,
		type,
		// TODO: move these to endpoint to use in +page.ts with better cachings
		// entry: entry ? validate_entry_type(entry) : undefined,
		entry,
		movie: type === 'movie' ? await tmdb.movie.details(+id) : null,
		book: type === 'book' ? await books.get(id.toString()) : null,
		tv: type === 'tv' ? await tmdb.tv.details(+id) : null,
		album: type === 'album' ? await spotify.album(id.toString()) : null,
		podcast,
		extras: {
			season: type === 'tv' && typeof season === 'number' ? await tmdb.tv.season(+id, season) : null
		}
	};
}

export type FullEntryDetail = Awaited<ReturnType<typeof entry_by_id>>;
export type EntryAnnotation = NonNullable<
	NonNullable<FullEntryDetail['entry']>['annotations']
>[number];

function validate_entry_type<TEntry extends { tweet?: unknown }>(
	entry: TEntry
): TEntry & {
	tweet: Tweet | undefined;
} {
	let tweet: Tweet | undefined = undefined;
	if (entry.tweet) {
		const { data, problems } = tweet_types.tweet(entry?.tweet);
		if (data) {
			tweet = data;
		} else {
			console.log({ problems });
		}
	}
	entry.tweet = tweet;
	return entry as TEntry & {
		tweet: Tweet | undefined;
	};
}

// same type as get_library
export const countLibrarySchema = z.object({
	status: z.nativeEnum(Status).nullable(),
	filter: z.object({
		type: z.nativeEnum(DocumentType).optional(),
		search: z.string().optional()
	})
});

export async function count_library({ input, ctx }: GetCtx<typeof countLibrarySchema>) {
	const { userId } = ctx;
	const { status, filter } = input;
	let query = db
		.selectFrom('Bookmark as b')
		.innerJoin('Entry as e', 'e.id', 'b.entryId')
		.where('b.userId', '=', userId)
		.select(({ fn, ref }) => [fn.count('e.id').as('count')]);
	if (status) {
		query = query.where('b.status', '=', status);
	}
	if (filter) {
		if (filter.type) {
			query = query.where('e.type', '=', filter.type);
		}
		if (filter.search) {
			query = query.where('e.title', 'like', `%${filter.search}%`);
		}
	}

	const { count } = await query.executeTakeFirstOrThrow();
	return {
		count: Number(count)
	};
}

function run_filters(
	query: SelectQueryBuilder<
		DB & {
			b: Bookmark;
		} & {
			e: Entry;
		},
		'b' | 'e',
		{}
	>,
	{
		filter,
		search
	}: {
		filter: FilterLibrarySchema;
		search?: string;
	}
) {
	if (search) {
		query = query.where('e.title', 'like', `%${search}%`);
	}
	if (filter) {
		const { createdAt, type } = filter;
		if (type) {
			query = query.where('e.type', '=', type);
		}
		if (createdAt) {
			const createdAts = Array.isArray(createdAt) ? createdAt : [createdAt];
			for (const createdAt of createdAts) {
				if ('gte' in createdAt && createdAt.gte) {
					if (createdAt.gte instanceof Date) {
						query = query.where('e.createdAt', '>=', createdAt.gte);
					} else {
						query = query.where(
							'b.createdAt',
							'<=',
							sql`NOW() - INTERVAL ${sql.raw(createdAt.gte.num + ' ' + createdAt.gte.unit)}`
						);
						// interval
					}
				} else if ('lte' in createdAt && createdAt.lte) {
					if (createdAt.lte instanceof Date) {
						query = query.where('e.createdAt', '<=', createdAt.lte);
					} else {
						query = query.where(
							'b.createdAt',
							'>=',
							sql`NOW() - INTERVAL ${sql.raw(
								createdAt.lte.num.toString() + ' ' + createdAt.lte.unit
							)}`
						);
					}
				} else if ('equals' in createdAt && createdAt.equals) {
					// use between start of day and end of day for equals
					const date = new Date(createdAt.equals).toISOString().slice(0, 10);
					query = query.where(
						sql`b.createdAt >= "${sql.raw(date)} 00:00:00"  AND b.createdAt <= "${sql.raw(
							date
						)} 23:59:59"`
					);
				}
			}
		}
	}
	return query;
}

// const saveToLibrarySchema = z.object({
//     id: z.number().int().or(z.string()),
//     type: typeSchema,
//     status: z.nativeEnum(Status).default("Backlog")
// })

export const saveToLibrarySchema = librarySchema.and(
	z.object({
		status: z.nativeEnum(Status).default('Backlog')
	})
);

export type SaveToLibrarySchema = z.input<typeof saveToLibrarySchema>;

/**
 * Given an entry id (or spotify/gbooks/tmdb/etc id), saves it to the library
 */
export async function save_to_library({ input, ctx }: GetCtx<typeof saveToLibrarySchema>) {
	let { entryId, status, type } = input;
	if (!entryId) {
		// then we need to create the entry
		const { id } = await createEntry(input);
		entryId = id;
	}

	const sort_order = await getFirstBookmarkSort(ctx.userId);

	await db
		.insertInto('Bookmark')
		.values({
			updatedAt: new Date(),
			userId: ctx.userId,
			entryId,
			sort_order,
			status
		})
		.onDuplicateKeyUpdate({
			status
		})
		.executeTakeFirst();
}

/**
 * Function to get media info and save it as an entry.
 * @param input Media ID Input
 * @returns New Entry
 */
export async function createEntry(input: z.input<typeof entryIdAndTypeSchema>) {
	// then we need to create the entry
	let insertable: Insertable<Entry> = {
		updatedAt: new Date()
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
					title: tv.name,
					text: tv.overview,
					uri: `tmdb:tv:${tv.id}`,
					tmdbId: tv.id,
					author: tv.created_by?.map((val) => val.name).join(', '),
					published: tv.first_air_date,
					image: tmdb.media(tv.poster_path),
					type: 'tv'
				};
			} else {
				const movie = await tmdb.movie.details(input.tmdbId);
				insertable = {
					...insertable,
					title: movie.title,
					html: movie.overview,
					uri: `tmdb:${movie.id}`,
					tmdbId: movie.id,
					author: movie.credits?.crew?.find((c) => c.job === 'Director')?.name,
					published: movie.release_date,
					image: tmdb.media(movie.poster_path),
					type: 'movie'
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
			insertable = {
				...insertable,
				title: book.volumeInfo.title,
				html: book.volumeInfo.description,
				uri: `isbn:${book.volumeInfo.industryIdentifiers?.find((i) => i.type === 'ISBN_13')
					?.identifier}`,
				googleBooksId: book.id,
				author: book.volumeInfo.authors?.join(', '),
				published: book.volumeInfo.publishedDate,
				image,
				type: 'book',
				publisher: book.volumeInfo.publisher,
				pageCount: book.volumeInfo.pageCount
			};
			break;
		}
		case 'podcast': {
			//todo
			const { episode } = await pindex.episodeById(Number(input.podcastIndexId));
			insertable = {
				...insertable,
				title: episode.title,
				text: episode.description,
				uri: episode.enclosureUrl,
				podcastIndexId: episode.id,
				published: new Date(episode.datePublished * 1000),
				type: 'podcast',
				image: episode.image || episode.feedImage
			};
			break;
		}
		case 'album': {
			const album = await spotify.album(input.spotifyId);
			insertable = {
				...insertable,
				title: album.name,
				uri: `spotify:album:${album.id}`,
				spotifyId: album.id,
				image: album.images[0]?.url,
				author: album.artists.map((a) => a.name).join(', '),
				published: new Date(album.release_date),
				type: 'album'
			};
			break;
		}
		default: {
			// TODO
			input.type;
		}
	}

	const entry = await db.insertInto('Entry').values(insertable).ignore().executeTakeFirstOrThrow();
	const entryId = Number(entry.insertId);
	if (entryId) {
		return {
			id: entryId,
			type,
			...insertable
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
	ctx: { userId }
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
		.where(({ eb, fn }) => eb(fn.coalesce('b.author', 'e.author'), 'is not', null))
		.where(({ eb, fn }) => eb(fn.coalesce('b.author', 'e.author'), 'is not', null))
		.where(sql`TRIM(COALESCE(b.author,e.author)) <> ''`)
		.select((eb) => eb.fn.coalesce('b.author', 'e.author').as('author'))
		.orderBy('author', 'asc')
		.distinct()
		.$narrowType<{ author: string }>()
		.execute();

	return authors.map((a) => a.author);
}

export const updateTagSchema = z.object({
	id: z.number(),
	data: z
		.object({
			name: z.string(),
			color: z.string()
			// TODO description etc.
		})
		.partial()
});

export type UpdateTagInput = z.input<typeof updateTagSchema>;

export async function updateTag({ input, ctx }: GetCtx<typeof updateTagSchema>) {
	await db
		.updateTable('Tag')
		.set(input.data)
		.where('id', '=', input.id)
		.where('userId', '=', ctx.userId)
		.execute();
}

export const createTagSchema = z.object({
	// The name of the tag
	name: z.string(),
	// The color of the tag. If none is provided, the default color will be used.
	color: z.string().optional()
});

type CreateTagInput = z.input<typeof createTagSchema>;

export async function createTag({ input, ctx }: GetCtx<typeof createTagSchema>) {
	const tag = await db
		.insertInto('Tag')
		.values({
			...input,
			userId: ctx.userId
		})
		.ignore()
		.executeTakeFirstOrThrow();

	return {
		id: Number(tag.insertId)
	};
}

export const convertToSchema = z
	.object({
		// The entry ID to convert
		id: z.number()
		// The type to convert to
	})
	.and(mediaIdSchema);

export async function convertTo({ input, ctx }: GetCtx<typeof convertToSchema>) {
	const { id, type } = input;
	const { userId } = ctx;

	// More to flesh out here...
	// const entry = await db.selectFrom('Entry').where('id', '=', id).executeTakeFirstOrThrow();

	let newEntry:
		| {
				id: number;
				type: DocumentType;
				spotifyId?: string | null;
				tmdbId?: number | null;
				googleBooksId?: string | null;
				podcastIndexId?: number | null;
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
		if (!newEntry) return;
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
							.where('c.userId', '=', userId)
					)
				])
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

export const notesInputSchema = z
	.object({
		filter: z.object({
			type: z.nativeEnum(AnnotationType)
		}),
		includeArchived: z.boolean().optional(),
		// Number of notes to return. Defaults to 50.
		take: z.number().default(50)
	})
	.deepPartial();


export async function notes({ input, ctx }: GetCtx<typeof notesInputSchema>) {
	const { filter, includeArchived } = input;

	const take = input.take || 50;

	// TODO: should we filter out replies?

	let query = db
		.selectFrom('Annotation as a')
		.select(annotations.select)
        .$narrowType<{
            contentData: JSONContent;
        }>()
		.select(withEntry)
		.select((eb) =>
			jsonArrayFrom(
				eb
					.selectFrom('annotation_tag as at')
					.innerJoin('Tag as t', 't.id', 'at.tagId')
					.select(['t.id', 't.name', 't.color'])
					.whereRef('at.annotationId', '=', 'a.id')
			).as('tags')
		)
		// this should always be on there - right?
		.where('a.userId', '=', ctx.userId)
		.orderBy('a.createdAt', 'desc')
		.limit(take);

	if (filter) {
		if (filter.type) {
			query = query.where('a.type', '=', filter.type);
		}
	}

	if (!includeArchived) {
		query = query.where('a.deleted', 'is', null);
	}

	return {
		notes: await query.execute()
		// todo: nextCursor
	};
}

export type Notes = Awaited<ReturnType<typeof notes>>['notes'];
export type Note = Notes[number];

export async function note({ input, ctx }: GetCtx<typeof idSchema>): Promise<Note> {
	const { id } = input;

	let query = db
		.selectFrom('Annotation as a')
		.select(annotations.select)
        .$narrowType<{
            contentData: JSONContent;
        }>()
		.select(withEntry)
		.select((eb) =>
			jsonArrayFrom(
				eb
					.selectFrom('annotation_tag as at')
					.innerJoin('Tag as t', 't.id', 'at.tagId')
					.select(['t.id', 't.name', 't.color'])
					.whereRef('at.annotationId', '=', 'a.id')
			).as('tags')
		)
		.where('a.id', '=', id)
		.where('a.userId', '=', ctx.userId)
		.executeTakeFirstOrThrow();

	return query;
}
