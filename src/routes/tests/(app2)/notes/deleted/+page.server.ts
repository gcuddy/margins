import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms/server';
import { z } from "zod";
import { validateAuthedForm } from '$lib/schemas';

const bulk_actions = z.object({
    ids: z.array(z.string())
})

export const load = (async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) throw error(401);

    const notes = db.selectFrom("Annotation")
        .selectAll()
        .where("userId", "=", session.user.userId)
        .where("type", "=", "document")
        .where("deleted", "is not", null)
        .orderBy("updatedAt", "desc")
        .limit(25)
        .execute();

    const bulkForm = superValidate(bulk_actions)

    return {
        notes,
        bulkForm
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    restore: validateAuthedForm(bulk_actions, async ({ form }) => {
        const { ids } = form.data;
        await db.updateTable("Annotation")
            .set({
                deleted: null
            })
            .where("id", "in", ids)
            .execute();
    })
}
