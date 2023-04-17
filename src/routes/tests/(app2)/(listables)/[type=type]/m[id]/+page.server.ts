import { TMDB_API_KEY } from "$env/static/private";
import type { Credits, Movie } from "tmdb-ts";
import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/db"

export const load = async (e) => {
    // get movie from tmdb
    const { id } = e.params;
    const res = fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits`);
    return {
        movie: res.then(res => res.json()) as Promise<Movie & {
            credits: Credits
        }>,
        // entry:
    }
}

export const actions: Actions = {
    bookmark: async ({ locals, params }) => {
        const session = await locals.validate();
        if (!session) {
            return fail(401)
        }
        const { insertId } = await db.insertInto("Entry")
            .values({
                updatedAt: new Date(),
                tmdbId: +params.id,
            })
            .ignore()
            .executeTakeFirstOrThrow();
        await db.insertInto("Bookmark")
            .values({
                updatedAt: new Date(),
                entryId: Number(insertId),
                userId: session.userId
            })
            .ignore()
            .executeTakeFirstOrThrow();

        // throw redirect(307, `/tests/app2/listables/entry/${params.id}`)
    }
}