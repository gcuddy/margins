import type { AnnotationSchema } from "$lib/annotation";
import { db, json } from "$lib/db"
import { annotations, withEntry } from "$lib/db/selects";
import { nanoid } from "$lib/nanoid";
import { BookmarkSchema } from "$lib/prisma/zod-prisma";
import { sql } from "kysely";
import { z } from "zod";

export async function searchEntries(q: string) {
    const entries = await db.selectFrom("Entry")
        .where(sql`MATCH(title,author,text) AGAINST (${q})`)
        .select([
            "id",
            "title",
            "type",
            "image",
            "published",
            "author",
            "googleBooksId",
            "tmdbId",
            "podcastIndexId"
        ])
        .limit(10)
        .orderBy("createdAt", "desc")
        .execute();
    return entries;
}

const id_schema = z.coerce.number().or(z.coerce.number().array());

const id_or_entryid = z.union([z.object({ entryId: id_schema }), z.object({ id: id_schema })])

export const updateBookmarkSchema =
    id_or_entryid.and(
        z.object({
            data: BookmarkSchema.partial().omit({ id: true, userId: true }),
        }))

export type UpdateBookmarkSchema = z.infer<typeof updateBookmarkSchema>

export async function updateBookmark(variables: UpdateBookmarkSchema & {
    userId: string;
}) {
    const { data, userId } = variables;
    let bookmarks = db.updateTable("Bookmark")
        .set(data)
        .where("userId", "=", userId)
    if ('id' in variables) {
        const { id } = variables;
        if (Array.isArray(id)) {
            bookmarks = bookmarks.where("id", "in", id)
        } else {
            bookmarks = bookmarks.where("id", "=", id)
        }
    } else {
        const { entryId } = variables;
        if (Array.isArray(entryId)) {
            bookmarks = bookmarks.where("entryId", "in", entryId)
        } else {
            bookmarks = bookmarks.where("entryId", "=", entryId)
        }
    }

    return await bookmarks.execute();

}

export const getNotebookSchema = z.object({
    cursor: z.coerce.date().optional(),
})

export type GetNotebookSchema = z.infer<typeof getNotebookSchema>

export async function getNotebook({ userId, cursor }: GetNotebookSchema & { userId: string }) {
    console.time("notebook")
    const take = 25;
    let query = db.selectFrom("Annotation as a")
        .innerJoin("Entry as e", "a.entryId", "e.id")
        .select(annotations.select)
        .select(withEntry)
        .where("userId", "=", userId)
        .where(({ or, cmpr }) => or([
            cmpr("a.type", "=", "annotation"),
            cmpr("a.type", "=", "note")
        ]))
        .where("deleted", "is", null)
        .orderBy("a.updatedAt", "desc")
        .limit(take + 1)
    if (cursor) {
        query = query.where("a.updatedAt", "<", cursor)
    }
    const notes = await query.execute();

    let nextCursor: Date | null = null;

    if (notes.length > take) {
        const nextItem = notes.pop();
        if (nextItem) {
            nextCursor = nextItem.updatedAt
        }
    }

    console.timeEnd("notebook")
    return { notes, nextCursor }
}

export function getTags(userId: string) {
    console.time("getTags");
    const tags = db.selectFrom("Tag")
        .select(["id", "name"])
        .where("userId", "=", userId)
        .execute();
    console.timeEnd("getTags");
    return tags;
}


export async function deleteAnnotation(userId: string, id: string) {
    await db.deleteFrom("Annotation")
        .where("userId", "=", userId)
        .where("id", "=", id)
        .execute();
}

export async function upsertAnnotation(data: z.infer<AnnotationSchema>,) {
    const { id: _id, ...annotation } = data;
    let id = _id;
    if (!id) {
        id = nanoid();
    }
    await db.insertInto("Annotation")
        .values({
            id,
            ...annotation,
            target: annotation.target ? json(annotation.target) : undefined,
        })
        .onDuplicateKeyUpdate({
            ...annotation,
            target: annotation.target ? json(annotation.target) : undefined,
        })
        .execute();
    return id;
}


export const s_add_to_collection = z.object({
    entryId: z.number().int().or(z.number().int().array()).optional(),
    collectionId: z.number().int(),
    annotationId: z.string().or(z.string().array()).optional()
}).refine(data => data.entryId || data.annotationId, "Must provide either entryId or annotationId");

export async function add_to_collection(input: z.infer<typeof s_add_to_collection> & {
    userId: string;
}) {
    if (Array.isArray(input.annotationId)) {
        return await db.insertInto("CollectionItems")
            .values(input.annotationId.map(id => ({
                collectionId: input.collectionId,
                annotationId: id,
                id: nanoid(),
                updatedAt: new Date()
            })))
            .execute();
    } else if (Array.isArray(input.entryId)) {
        return await db.insertInto("CollectionItems")
            .values(input.entryId.map(id => ({
                collectionId: input.collectionId,
                entryId: id,
                id: nanoid(),
                updatedAt: new Date()
            })))
            .execute();
    } else {
        return await db.insertInto("CollectionItems")
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
