import { error } from "@sveltejs/kit";
import { db } from "$lib/db";
export async function load({ locals }) {
    const session = await locals.validate();
    if (!session) throw error(401, "Not logged in")
    const views = db.selectFrom("SmartList")
        .where("userId", "=", session.userId)
        .select(["id", "name"])
        .execute()
    return {
        views
    }
}