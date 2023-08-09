import { bulkEntriesSchema, validateAuthedForm } from "$lib/schemas.js"
import { fail, redirect } from "@sveltejs/kit"
import { z } from "zod";

import { db } from "$lib/db"
import type { Actions } from "./$types";
import { getFirstBookmarkSort } from "$lib/db/selects";
export const load = () => {
    throw redirect(302, "/tests/library/now")
}

// entryids
const idSchema = z.array(z.coerce.number()).nonempty();
const statusSchema = z.enum(["Backlog", "Now", "Archive"])

export const actions: Actions = {
    update: validateAuthedForm(bulkEntriesSchema, (e) => {
        console.log(e)
    }),
    update_status: async ({ locals, request, url }) => {
        const sesh = await locals.auth.validate();
        if (!sesh) return fail(401);
        // get ids
        const data = await request.formData();
        try {
            console.log('ids', data.getAll("ids"))
            console.log('status', data.get("status"))
            const ids = idSchema.parse(data.getAll("id"));
            const status = statusSchema.parse(data.get("status") ?? url.searchParams.get('status'));

            // sort to top of list
            const new_sort_order = await getFirstBookmarkSort(sesh.userId, status);
            await db.updateTable("Bookmark")
                .where("entryId", "in", ids)
                .where("userId", "=", sesh.userId)
                .set({
                    status,
                    sort_order: new_sort_order
                })
                .execute();
        } catch (e) {
            console.dir({ e }, { depth: null })
            return fail(400);
        }
    }
}
