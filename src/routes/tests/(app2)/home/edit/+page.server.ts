import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { db, json } from "$lib/db";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

const schema = z.string().array()

export const load = (async ({ locals }) => {
    const { user } = await locals.validateUser();
    if (!user) throw redirect(303, "/tests/login")
    return {
        user
    }
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const session = await locals.validate();
        if (!session) return fail(401);
        const data = await request.formData();
        const ids = schema.parse(data.getAll("id"));
        await db.updateTable("user")
            .set({
                home_items: json(ids)
            })
            .execute();
    }
}