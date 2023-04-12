import { createCachedValue } from "$lib/cache";
import { db } from "$lib/db";

function getTags(userId: string) {
    console.time("getTags");
    const tags = db.selectFrom("Tag")
        .select(["id", "name"])
        .where("userId", "=", userId)
        .execute();
    console.timeEnd("getTags");
    return tags;
}

export const load = async (event) => {

    const session = await event.locals.validate();
    if (!session) {
        return {}
    }
    return {
        user_data: {
            // lazy loaded promises
            tags: createCachedValue("tags", () => getTags(session.userId)),
        }
    }
}