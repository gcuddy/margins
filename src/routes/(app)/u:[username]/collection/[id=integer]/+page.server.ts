import { fail } from "@sveltejs/kit";

import { createCaller } from "$lib/trpc/router";
import { createCollectionItemSchema } from "$lib/trpc/routes/collections";

import type { Actions } from "./$types";


export const actions: Actions = {
    favorite: async (e) => {
        const caller = await createCaller(e);
        const data = await e.request.formData();
        return caller.favorites.create({
            collectionId: Number(e.params.id),
            sortOrder: Number(data.get("sortOrder")),
        });
    },
    addSection: async (e) => {
        const caller = await createCaller(e);
        let obj = Object.fromEntries(await e.request.formData()) as Record<string, string | number>;
        obj = {
            ...obj,
            type: "Section",
            collectionId: Number(e.params.id),
        };
        console.log({obj})
        const data = createCollectionItemSchema.safeParse(obj);
        if (!data.success) {
            return fail(400, { error: JSON.stringify(data.error, null, 2) });
        }
        return caller.collections.createItem(data.data);
    }
};
