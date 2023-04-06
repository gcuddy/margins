import type { PageServerLoad } from './$types';
import { db } from "$lib/db";
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql'
import { redirect } from '@sveltejs/kit';


export const load = (async ({ locals, url }) => {
    const session = await locals.validate();
    if (!session) {
        throw redirect(307, "/login?redirect=" + url.pathname);
    }
    const userId = session.userId;
    console.time("entries")
    let entries = await db
        .selectFrom("Bookmark as b")
        .innerJoin("Entry as e", "e.id", "b.entryId")
        .innerJoin("State as s", "s.id", "b.stateId")
        .leftJoin("EntryInteraction as i", (j) =>
            j.onRef("i.entryId", "=", "e.id").on("i.userId", "=", userId)
        )
        .select([
            "e.id",
            "e.image",
            "e.published",
            "e.type",
            "e.title",
            "e.author",
            "e.uri",
            // "i.progress",
            // "s.name as state",
            // sql<string>`(select count(a.id) from Annotation a where a.entryId = e.id)`.as(
            //     "annotations"
            // ),
            // sql<string>`(select count(r.id) from Relation r where r.entryId = e.id or r.relatedEntryId = e.id)`.as(
            //     "relations"
            // ),
        ])
        .select((eb) => [
            jsonArrayFrom(eb.selectFrom("Annotation")
                .select(["Annotation.id", "Annotation.contentData"])
                .whereRef("Annotation.entryId", "=", "e.id")
            ).as("annotations"),
            jsonObjectFrom(eb.selectFrom("State as s")
                .select(["s.id", "s.name"])
                .whereRef("s.id", "=", "b.stateId")
            ).as("state"),
            jsonObjectFrom(eb.selectFrom("EntryInteraction as i")
                .select(["i.progress"])
                .whereRef("i.entryId", "=", "e.id")
                .where("i.userId", "=", userId)
            ).as("interaction"),
        ])
        .where("b.userId", "=", userId)
        .orderBy("b.createdAt", "desc")
        .limit(10)
        .execute();
    console.timeEnd("entries")
    return {
        entries
    };
})