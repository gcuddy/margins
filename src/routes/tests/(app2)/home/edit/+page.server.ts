import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { db, json } from "$lib/db";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

const schema = z.string().array()

export const load = (async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) throw redirect(303, "/tests/login")
    const { user } = session;
    return {
        user
    }
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const session = await locals.auth.validate();
        if (!session) return fail(401);
        const data = await request.formData();
        const ids = schema.parse(data.getAll("id"));
        await db.updateTable("auth_user")
            .set({
                home_items: json(ids)
            })
            .execute();
    }
}
