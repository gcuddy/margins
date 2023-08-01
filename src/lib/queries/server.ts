import { annotationSchema, type AnnotationSchema } from '$lib/annotation';
import { db, json } from '$lib/db';
import { annotations, entrySelect, withEntry } from '$lib/db/selects';
import { tagSchema } from '$lib/features/entries/forms';
import { nanoid } from '$lib/nanoid';
import { BookmarkSchema } from '$lib/prisma/zod-prisma';
import { RelationType } from '@prisma/client';
import { sql } from 'kysely';
import { z } from 'zod';

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
		.innerJoin('Tag as t', (join) => join.onRef('t.id', '=', 'at.tagId').on("t.name", "=", name))
        .select(annotations.select)
        .select('t.id as tag_id')
        .where('a.userId', '=', userId)
		.where('deleted', 'is', null)
		.orderBy('a.updatedAt', 'desc')

    return await query.execute();

}
