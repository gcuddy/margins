import { db } from "$lib/db"
import type { Annotation, Collection, CollectionItems, DB, Entry, Feed } from "$lib/prisma/kysely/types";
import type { RelationType, Status } from "@prisma/client";
import type { ExpressionBuilder, InferResult, OrderByExpression, RawBuilder, ReferenceExpression, SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";

type S = SelectExpression<DB & Record<"e", Entry>, "e">;

export const entrySelect = [
    "e.id",
    "e.image",
    "e.published",
    "e.type",
    "e.title",
    "e.author",
    "e.uri",
    "e.tmdbId",
    "e.googleBooksId",
    "e.podcastIndexId",
    "e.spotifyId",
    "e.wordCount"
] as const satisfies Readonly<S[]>

export function selectEntryInList() {
    const a = db.selectFrom("Entry as e")
        .select(entrySelect);
    return a;
}

export type EntryInList = InferResult<ReturnType<typeof selectEntryInList>>[number] & {
    sort_order?: number;
    progress?: number | null;
    status?: Status;
    tags?: { id: number; name: string; }[];
    annotations?: AnnotationsInEntry[];
    num_annotations?: `${number}` | number;
    relations?: {
        id: string;
        type: RelationType;
        entry?: EntryInList;
    }[];
    collections?: {
        id: number;
        name: string;
    }[];
}


export const collectionItem = {
    withAnnotation: (eb: ExpressionBuilder<DB, "CollectionItems">): RawBuilder<{
        id: string;
        body: string | null;
        contentData: unknown | null;
    } | null> => {
        return jsonObjectFrom(
            eb.selectFrom("Annotation as a")
                .select(["a.id", "a.body", "a.contentData"])
                .whereRef("a.id", "=", "CollectionItems.annotationId")
        )
    }
}

export const entry = {
    withAnnotations: ["Annotation.id", "Annotation.contentData", "Annotation.start", "Annotation.body", "Annotation.target", "Annotation.entryId", "auth_user.username", "Annotation.title", "Annotation.exact", "Annotation.createdAt"] as const
}

function entryAnnotations() {
    return db.selectFrom("Annotation")
        .leftJoin("auth_user", "Annotation.userId", "auth_user.id")
        .select(entry.withAnnotations)
}

export type AnnotationsInEntry = InferResult<ReturnType<typeof entryAnnotations>>[number];

type AliasedAEb = ExpressionBuilder<DB & Record<"a", Annotation>, "a">

export const annotations = {
    notebook_select: ["a.id", "a.title", "a.body", "a.userId", "a.deleted", "a.target", "a.type", "a.exact",
        "e.title as entry_title", "e.id as entry_id", "e.type as entry_type", "e.uri as entry_uri", "e.image as entry_image", "e.author as entry_author", "e.podcastIndexId", "e.googleBooksId", "e.tmdbId"
    ] as const,
    select: ["a.id", "a.title", "a.body", "a.userId", "a.deleted", "a.target", "a.type", "a.exact", "a.updatedAt"] as const,
    with: {
        references: (eb: AliasedAEb) => {
            return jsonArrayFrom(eb.selectFrom("annotation_to_entry_reference as r")
                .innerJoin("Entry as e", "r.entryId", "e.id")
                .select(entrySelect)
                .whereRef("r.annotationId", "=", "a.id")
            ).as('references')
        },
        tags: (eb: AliasedAEb) => jsonArrayFrom(
            eb.selectFrom("annotation_tag as at")
                .innerJoin("Tag as t", "at.annotationId", "a.id")
                .select(["t.id", "t.name"])
                .whereRef("at.annotationId", "=", "a.id")
        ).as('tags'),
        username: <T extends string>(eb: AliasedAEb, as: T) => jsonObjectFrom(
            eb.selectFrom("user as u")
                .select("username")
                .whereRef("a.userId", "=", "u.id")
        ).as(as),
        parent: (eb: AliasedAEb) => jsonObjectFrom(
            eb.selectFrom("Annotation as parent")
                .whereRef("parent.id", "=", "a.parentId")
                .select(annotations.select)
        ).as('parent')
    }
}

export function contextual_annotation(eb: AliasedAEb) {
    return [
        annotations.with.tags(eb),
        annotations.with.username(eb, 'creator'),
        withEntry(eb)
    ]
}

export const feed = {
    withEntries: (eb: ExpressionBuilder<DB & Record<"f", Feed>, "f">, limit = 25, after?: Date) => {
        let query = eb.selectFrom("Entry as e")
            .select(entrySelect)
            .whereRef("e.feedId", "=", "f.id")
            .orderBy("e.published", "desc")
            .limit(limit + 1);
        if (after) {
            query = query.where("e.published", "<", after)
        }
        return jsonArrayFrom(query).as('entries')
    }
}

export function withEntry(eb: ExpressionBuilder<DB & Record<"a", Annotation>, "a">) {
    return jsonObjectFrom(
        eb.selectFrom('Entry as e')
            .select(entrySelect)
            .whereRef('e.id', '=', "a.entryId")
    ).as('entry')
}



export function genericWithEntry<EB extends ExpressionBuilder<DB, keyof DB>, Alias extends string | void = void,>(eb: EB, ref: ReferenceExpression<DB, keyof DB>) {
    return jsonObjectFrom(
        eb.selectFrom('Entry as e')
            .select(entrySelect)
            .whereRef('e.id', '=', ref)
    ).as('entry')
}

// private just for type inference
export function annotationWithEntry() {
    const a = db.selectFrom("Annotation as a")
        .select(annotations.select)
        .select(withEntry);
    return a;
}


export type AnnotationWithEntry = InferResult<ReturnType<typeof annotationWithEntry>>[number];

// extract type
function annotationNotebookSelect() {
    const a = db.selectFrom("Annotation as a")
        .leftJoin("Entry as e", "a.entryId", "e.id")
        .select(annotations.notebook_select);
    return a;
};


export type AnnotationNotebook = InferResult<ReturnType<typeof annotationNotebookSelect>>[number];

export async function getFirstBookmarkSort(userId: string, status?: Status) {
    let query = db.selectFrom("Bookmark")
        .select(eb => eb.fn.min("sort_order").as("sort_order"))
        .where("userId", "=", userId)
    if (status) {
        query = query.where("status", "=", status)
    }
    const { sort_order } = await query.executeTakeFirstOrThrow();
    return sort_order - 100;
}
