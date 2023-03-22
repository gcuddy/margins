import { redirect } from "@sveltejs/kit";
import { db } from "$lib/db"

export const load = async ({ locals }) => {
    const session = await locals.validate();
    if (!session) {
        throw redirect(307, "/login")
    }
    // move to trpc, but...
    const tags = db
        .selectFrom("Tag as t")
        .innerJoin("TagOnEntry as te", "te.tagId", "t.id")
        .select(["t.name", "te.entryId"])
        .where("te.userId", "=", session.userId)
        .execute();
    const states = db
        .selectFrom("State as s")
        .innerJoin("user as u", "u.id", "s.userId")
        .select(["s.name", "u.id", "s.type"])
        .where("u.id", "=", session.userId)
        .execute();
    return {
        lazy: {
            tags,
            states
        }
    }
}
