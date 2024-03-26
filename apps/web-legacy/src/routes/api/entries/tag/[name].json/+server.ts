import { db } from "$lib/db"
import { entrySelect } from "$lib/db/selects";
import { error, json } from "@sveltejs/kit";
export async function GET({ locals, params, url }) {
    const session = locals.session;
    if (!session) error(401, "Unauthorized");

    const cursor = url.searchParams.get("cursor") || undefined;

    let query = db.selectFrom("TagOnEntry as toe")
        .innerJoin("Entry as e", "e.id", "toe.entryId")
        .innerJoin("Tag as t", (join) => join.onRef("t.id", "=", "toe.tagId").on("t.name", "=", params.name))
        .select(entrySelect)
        .select(['t.id as tag_id'])
        .where("toe.userId", "=", session.user.userId)
        .orderBy("toe.id", "desc");

    if (cursor) {
        query = query.where("toe.id", "<", Number(cursor))
    }

    const entries = await query.limit(25 + 1).execute();

    const hasMore = entries.length > 25;

    let nextCursor;
    if (hasMore) {
        const nextItem = entries.pop();
        if (nextItem) {
            nextCursor = nextItem.id;
        }
    }

    return json({
        entries,
        nextCursor,
    })
}
