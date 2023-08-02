import { annotationSchema, type AnnotationSchema } from '$lib/annotation';
import pindex from '$lib/api/pindex';
import { Tweet, tweet_types } from '$lib/api/twitter';
import { db, json } from '$lib/db';
import { annotations, entrySelect, withEntry } from '$lib/db/selects';
import {
	bookmarkSchema,
	tagSchema,
	updateBookmarkSchema as form_updateBookmarkSchema
} from '$lib/features/entries/forms';
import { nanoid } from '$lib/nanoid';
import { BookmarkSchema } from '$lib/prisma/zod-prisma';
import { interactionSchema } from '$lib/schemas';
import { typeSchema } from '$lib/types';
import { RelationType } from '@prisma/client';
import { sql } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { tmdb } from '$lib/api/tmdb';
import { books } from '$lib/api/gbook';
import spotify from '$lib/api/spotify';

type GetCtx<T extends z.ZodTypeAny> = {
	input: z.infer<T>;
	ctx: {
		userId: string;
	};
};

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
		data: BookmarkSchema.partial().omit({ id: true, userId: true })
	})
);

export type UpdateBookmarkSchema = z.infer<typeof updateBookmarkSchema>;

export async function updateBookmark(
	variables: UpdateBookmarkSchema & {
		userId: string;
	}
) {
	const { data, userId } = variables;
	let bookmarks = db.updateTable('Bookmark').set(data).where('userId', '=', userId);
	if ('id' in variables) {
		const { id } = variables;
		if (Array.isArray(id)) {
			bookmarks = bookmarks.where('id', 'in', id);
		} else {
			bookmarks = bookmarks.where('id', '=', id);
		}
	} else {
		const { entryId } = variables;
		if (Array.isArray(entryId)) {
			bookmarks = bookmarks.where('entryId', 'in', entryId);
		} else {
			bookmarks = bookmarks.where('entryId', '=', entryId);
		}
	}

	return await bookmarks.execute();
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
	tags: z
		.object({
			id: z.number(),
			name: z.string()
		})
		.array()
		.default([])
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
		// set tags on annotation
		// TODO
		// transaction - if one fails, all fail
		await db.transaction().execute(async (trx) => {
			await trx.deleteFrom('annotation_tag').where('annotationId', '=', id!).execute();

			return await trx
				.insertInto('annotation_tag')
				.values(
					tags.map((tag) => ({
						annotationId: id!,
						tagId: tag.id
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
}: z.infer<typeof tagsOnEntrySchema> & { userId: string }) {
	// First, delete all tags on entries
	// await db.deleteFrom("TagOnEntry").where("entryId", "in", entries).execute();

	const tagsToAdd = tags.filter((tag) => !tag.id);
	const tagIds = tags
		.filter((tag) => tag.id)
		.map((tag) => tag.id)
		.filter(Boolean);
	if (!tagIds.length) {
		// then delete all existing tags on these entries
		await db.deleteFrom('TagOnEntry').where('entryId', '=', entries).execute();
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

	let podcast: ReturnType<typeof pindex['episodeById']> | null = null;

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
				podcast = pindex.episodeById(+podcastIndexId);
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
					? BigInt(id.toString().slice(1))
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
		tagForm,
		updateBookmarkForm,
		bookmarkForm,
		annotationForm,
		interactionForm,
		type,
		// TODO: move these to endpoint to use in +page.ts with better cachings
		entry: entry ? validate_entry_type(entry) : undefined,
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
