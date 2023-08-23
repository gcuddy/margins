import { db } from "$lib/db"
import { nanoid } from "$lib/nanoid";
import { validateAuthedForm } from "$lib/schemas";
import { error } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";

const bulk_actions = z.object({
    ids: z.array(z.string())
})

const addToCollection = bulk_actions.extend({
    collectionId: z.number().int()
})

export async function load({ locals }) {
    // get annotations
    const session = await locals.auth.validate();
    if (!session) throw error(401);
    const notes = await db.selectFrom("Annotation")
        .selectAll()
        .where("userId", "=", session.user.userId)
        .where("type", "=", "document")
        .where("deleted", "is", null)
        .orderBy("createdAt", "desc")
        .limit(10)
        .execute();

    return {
        notes,
        bulkForm: superValidate(bulk_actions)
    }
}

export const actions = {
    delete: validateAuthedForm(bulk_actions, async ({ form, session }) => {
        await db.updateTable("Annotation")
            .set({
                deleted: new Date()
            })
            .where("id", "in", form.data.ids)
            .where("userId", "=", session.user.userId)
            .execute();
    }),
    addToCollection: validateAuthedForm(addToCollection, async ({ form, session }) => {
        const { ids, collectionId } = form.data;
        await db.insertInto("CollectionItems")
            .values(ids.map(id => ({
                collectionId: collectionId,
                annotationId: id,
                id: nanoid(),
                updatedAt: new Date()
            })))
            .execute();
    })
}
