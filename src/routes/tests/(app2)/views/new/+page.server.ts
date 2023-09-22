import { db, json } from "$lib/db";
import { bulkEntriesSchema } from "$lib/schemas";
import { error, fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { type Condition, View, types } from "./View.js";
import type { Actions, PageServerLoad } from "./$types";




export const load = (async ({ url, locals, cookies }) => {

    const view = new View(cookies.get("view"));

    // object from searchparams
    const obj = Object.fromEntries(new URLSearchParams(url.search));
    console.log({ obj, view });

    const session = await locals.auth.validate();
    if (!session) throw error(401, "Not logged in")

    return {
			conditions: view.conditions,
			name: view.name,
			bulkForm: superValidate(bulkEntriesSchema),
			// include tags if there is a tag condition (for js-less users)
			tags: view.conditions.some((condition) => condition.type === 'Tag')
				? db
						.selectFrom('Tag')
						.where('userId', '=', session.user.userId)
						.select(['name', 'id'])
						.orderBy('name', 'asc')
						.execute()
				: [],
			condition_types: types,
			// view,
		};

}) satisfies PageServerLoad;

export const actions: Actions = {
    add: async ({ cookies, request }) => {
        const view = new View(cookies.get("view"));
        const data = await request.formData();
        view.update(data);
        const type = data.get("add_type") as Condition["type"];
        view.add(type);
        cookies.set("view", view.toString())
    },
    clear: ({ cookies }) => {
        cookies.set("view", "")
    },
    delete: async ({ request, cookies }) => {
        console.time("delete")
        const data = await request.formData();
        const id = data.get("id") as Condition["id"];
        const view = new View(cookies.get("view"));
        view.delete(id);
        cookies.set("view", view.toString())
        console.timeEnd("delete")
    },
    save: async ({ cookies, request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) return fail(401)
        const view = new View(cookies.get("view"));
        const data = await request.formData();
        view.update(data);
        const l = await db.insertInto("SmartList")
            .values({
                conditions: json(view.conditions),
                name: view.name,
                userId: session.user.userId
            })
            .executeTakeFirst();

        cookies.set("view", "")
        if (l.insertId) {
            throw redirect(303, `/tests/views/${Number(l.insertId)}`)
        }
    },
    preview: async ({ cookies, request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) return fail(401)
        const view = new View(cookies.get("view"));

        // build conditions
        const data = await request.formData();
        view.update(data);
        cookies.set("view", view.toString())

        if (!view.conditions.length) {
            // need conditions to prevent a full table scanq
            return {
                entries: []
            }
        }
        const { entries } = await View.preview(view.conditions, session.user.userId);
        console.log({ entries })
        return {
            entries
        }
    }
}
