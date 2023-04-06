import type { PageServerLoad } from './$types';
import { db } from "$lib/db";
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql'


export const load = (async ({ params }) => {
    const { id } = params;
    console.time("entry")
    const entry = await db.selectFrom("Entry")
        .select(["id", "title", "html"])
        .select((eb) =>
            [
                jsonArrayFrom(eb.selectFrom("Annotation")
                    .select(["Annotation.id", "Annotation.contentData"])
                    .whereRef("Annotation.entryId", "=", "Entry.id")
                    .orderBy("Annotation.createdAt", "asc")).as("annotations"),
                jsonArrayFrom(eb.selectFrom("Collection as c")
                    .select(["c.id", "c.contentData"])
                    .innerJoin("CollectionItems as ci", "ci.collectionId", "c.id")
                    .whereRef("ci.entryId", "=", "Entry.id")
                ).as("collections"),
                jsonArrayFrom(eb.selectFrom("Relation as r")
                    .innerJoin("Entry as e", "e.id", "r.relatedEntryId")
                    .select(["r.entryId", "r.type", "e.title as related_entry_title", "e.id as related_entry_id",])
                    .whereRef("r.entryId", "=", "Entry.id")).as("relations"),
                jsonObjectFrom(eb.selectFrom("Bookmark")
                    .select(["Bookmark.id",])
                    .whereRef("Bookmark.entryId", "=", "Entry.id")
                ).as("bookmark"),
            ]
        )
        .where("Entry.id", "=", +id)
        .executeTakeFirstOrThrow();
    console.timeEnd("entry")
    return {
        entry
    };
})