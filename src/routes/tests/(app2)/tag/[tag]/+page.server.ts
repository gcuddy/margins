import { db } from "$lib/db"
import { nanoid } from "$lib/nanoid";
import { bulkEntriesSchema } from "$lib/schemas";
import pin from "$lib/server/actions/pin";
import { error, fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";

export async function load({ locals, params }) {

    const session = await locals.validate();
    const { tag } = params;

    if (!session) {
        throw error(401, "Unauthorized");
    }

    const tag_deets = await db.selectFrom("Tag")
        .leftJoin("Favorite as pin", "pin.tagId", "Tag.id")
        .where("Tag.name", "=", tag)
        .where("Tag.userId", "=", session.userId)
        .select(["Tag.id", "Tag.name", "pin.id as pin_id"])
        .executeTakeFirstOrThrow();

    return {
        tag: tag_deets,
        session,
        bulkForm: superValidate(bulkEntriesSchema),
    }
}

export const actions = {
    pin: async ({ locals, request }) => {
        const session = await locals.validate();
        if (!session) return fail(401);

        const data = await request.formData();

        const pin_id = data.get("pin_id");
        const tag_id = data.get("tag_id");

        if (!tag_id || typeof tag_id !== "string") return fail(400, {
            message: "tag_id is required"
        });

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
                    tagId: +tag_id
                })
                .execute();

        }
    }
}