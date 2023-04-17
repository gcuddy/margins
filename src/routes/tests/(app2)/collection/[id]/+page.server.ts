import { db } from "$lib/db";
import { error } from "@sveltejs/kit";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";

export async function load({ params, locals }) {
    const { user } = await locals.validateUser();
    if (!user) throw error(401)
    console.time("collection")
    const collection = await db.selectFrom("Collection as c")
        .select(["c.id", "c.name"])
        .select(eb => [
            jsonArrayFrom(
                eb.selectFrom('CollectionItems as ci')
                    .innerJoin("Entry as e", "e.id", "ci.entryId")
                    .select(["ci.id", "ci.entryId", "ci.note", "e.title as entry_title"])

                    // .select(eb => [
                    //     jsonObjectFrom(
                    //         eb.selectFrom('Entry as e')
                    //             .select(["e.id", "e.title", "e.uri", "e.image"])
                    //             .whereRef('e.id', '=', 'ci.entryId')
                    //     ).as("entry")
                    // ])
                    .whereRef('ci.collectionId', '=', 'c.id')
                    .orderBy('ci.position')
            ).as('items'),
        ])
        .where("userId", "=", user.userId)
        .where("id", "=", +params.id)
        .executeTakeFirstOrThrow();
    console.timeEnd("collection")
    return {
        collection
    }
}