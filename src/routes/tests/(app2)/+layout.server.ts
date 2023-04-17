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

    const { user } = await event.locals.validateUser();
    if (!user) {
        return {}
    }
    return {
        user_data: {
            // lazy loaded promises
            tags: createCachedValue("tags", () => getTags(user.userId)),
            ...user
        }
    }
}