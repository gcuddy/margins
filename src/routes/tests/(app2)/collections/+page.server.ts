import { db } from "$lib/db"
import { nameSchema, validateAuthedForm } from "$lib/schemas";
import { error, redirect } from "@sveltejs/kit";
import { jsonArrayFrom } from "kysely/helpers/mysql";
import { superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad } from "./$types";


export const load = (async ({ locals }) => {
    const session = await locals.validate();
    if (!session) throw error(401)
    console.time("collections")
    const collections = await db.selectFrom("Collection as c")
        .select(["c.name", "c.id"])
        .select(eb => [
            jsonArrayFrom(
                eb.selectFrom("CollectionItems as ci")
                    .innerJoin("Entry as e", "e.id", "ci.entryId")
                    .select(["ci.id", "e.image"])
                    .whereRef("ci.collectionId", "=", "c.id")
                    .limit(5)
            ).as("items")
        ])
        .where("userId", "=", session.userId)
        .orderBy("c.createdAt", "desc")
        .execute();
    console.timeEnd("collections")
    const form = superValidate(nameSchema)
    return {
        collections,
        form
    }
}) satisfies PageServerLoad

export const actions = {
    default: validateAuthedForm(nameSchema, async ({ form, session }) => {
        const { name } = form.data;

        const collection = await db.insertInto("Collection")
            .values({ name, updatedAt: new Date(), userId: session.userId })
            .executeTakeFirst();
        const id = Number(collection.insertId);

        if (id && Number.isInteger(id)) {
            throw redirect(
                303,
                `/tests/collection/${id}`)
        }
        return {
            form,
        }
    })
}