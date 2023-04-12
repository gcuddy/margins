import { superValidate } from 'sveltekit-superforms/server';
import type { LayoutServerLoad } from './$types';
import { tagSchema, updateBookmarkSchema } from '$lib/features/entries/forms';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import { db } from '$lib/db'
import { annotationSchema } from '$lib/annotation';

export const load = (async (event) => {
    const { id } = event.params;
    console.time("entry");
    const entry = await db.selectFrom("Entry")
        .select(["id", "title", "html"])
        // get user content (TODO: move to separate query or conditional)
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
                jsonArrayFrom(eb.selectFrom("TagOnEntry as toe")
                    .innerJoin("Tag as t", "t.id", "toe.tagId")
                    .select(["t.id", "t.name"])
                    .whereRef("toe.entryId", "=", "Entry.id")
                    // .whereRef() <- user id
                )
                    .as("tags"),
                jsonObjectFrom(eb.selectFrom("Bookmark")
                    .select(["id", "status"])
                    .whereRef("Bookmark.entryId", "=", "Entry.id")
                ).as("bookmark"),
            ]
        )
        .where("Entry.id", "=", +id)
        .executeTakeFirstOrThrow();
    console.timeEnd("entry");
    const tagForm = superValidate({
        tags: entry.tags
    }, tagSchema, { id: "tag" });
    const updateBookmarkForm = superValidate(entry.bookmark, updateBookmarkSchema, { id: "update" });
    const annotationForm = superValidate(event, annotationSchema, { id: "annotation" });
    return {
        tagForm,
        entry,
        updateBookmarkForm,
        annotationForm
    };
}) satisfies LayoutServerLoad;