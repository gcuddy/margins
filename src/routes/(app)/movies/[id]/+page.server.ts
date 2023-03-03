import { fail } from "@sveltejs/kit";

import { createCaller } from "$lib/trpc/router";
import { SaveMovieSchema } from "$lib/trpc/routes/movies";

import type { Actions } from "./$types";

export const actions: Actions = {
    save: async (e) => {
        const caller = await createCaller(e);
        const parsed = SaveMovieSchema.safeParse({
            ...Object.fromEntries(await e.request.formData()),
            tmdbId: +e.params.id,
            type: "movie",
        });
        console.log({ parsed })
        if (!parsed.success) {
            return fail(400, {
                message: parsed.error.message,
            });
        }
        return await caller.movies.save(parsed.data);
    },
};
