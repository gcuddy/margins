import { redirect } from "@sveltejs/kit";
import { db } from "$lib/db"

export const load = async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw redirect(307, "/login")
    }
    // move to trpc, but...
    // const tags = db
    //     .selectFrom("Tag as t")
    //     .leftJoin("TagOnEntry as te", "te.tagId", "t.id")
    //     .leftJoin("annotation_tag as at", "at.tagId", "t.id")
    //     .select(["t.name", "t.id", "te.entryId", "at.annotationId"])
    //     .where("te.userId", "=", session.user.userId)
    //     .execute();
    // const states = db
    //     .selectFrom("State as s")
    //     .innerJoin("user as u", "u.id", "s.userId")
    //     .select(["s.name", "u.id", "s.type"])
    //     .where("u.id", "=", session.user.userId)
    //     .execute();
    return {
        lazy: {
            // tags, states
        }
    }
}
