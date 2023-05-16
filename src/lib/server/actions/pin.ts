import { db } from "$lib/db";
import { nanoid } from "$lib/nanoid";
import type { Favorite } from "@prisma/client";
import { type Action, fail, type RequestEvent } from "@sveltejs/kit";
import type { RequireAtLeastOne } from "type-fest";

const pin = async ({ locals, request }: RequestEvent, insert: RequireAtLeastOne<Pick<Favorite, 'smartListId' | 'collectionId' | 'tagId'>>) => {
    const session = await locals.validate();
    if (!session) return fail(401);

    const data = await request.formData();

    const pin_id = data.get("pin_id");

    if (pin_id && typeof pin_id === "string") {
        await db.deleteFrom("Favorite")
            .where("id", "=", pin_id)
            .where("userId", "=", session.userId)
            .execute();
    }
    else {
        // insert
        const id = nanoid();
        await db.insertInto("Favorite")
            .values({
                id,
                userId: session.userId,
                updatedAt: new Date(),
                ...insert
            })
            .execute();
    }
}

export default pin;