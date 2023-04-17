import { db } from "$lib/db"
import { error } from "@sveltejs/kit";

export async function load({ locals, params }) {

    const { user, session } = await locals.validateUser();
    const { tag } = params;

    if (!user) {
        throw error(401, "Unauthorized");
    }

    let entryQuery = db.selectFrom("TagOnEntry as toe")
        .innerJoin("Entry as e", "e.id", "toe.entryId")
        .innerJoin("Tag as t", (join) => join.onRef("t.id", "=", "toe.tagId").on("t.name", "=", tag))
        .select(["e.id", "e.title", "e.type", "e.googleBooksId", "e.tmdbId", "e.image", "e.uri"])
        .where("toe.userId", "=", user.userId)
    // TODO: where owned by bookmarked by or tagged by user

    return {
        entries: entryQuery.execute(),
        tag
    }
}