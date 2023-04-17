import { db } from "$lib/db"
import { error } from "@sveltejs/kit";

export async function load({ params, locals }) {
    const { user } = await locals.validateUser();
    if (!user) throw error(401)
    const collections = await db.selectFrom("Collection")
        .select(["name", "id"])
        .where("userId", "=", user.userId)
        .execute();

    return {
        collections
    }
}