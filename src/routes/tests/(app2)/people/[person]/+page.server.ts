import { tmdb } from "$lib/api/tmdb.js";
import { db } from "$lib/db"
import { handleLoginRedirect } from "$lib/utils/redirects.js";
import { redirect } from "@sveltejs/kit";




export async function load({ params, locals, url }) {
    const { person } = params;

    const session = await locals.validate();

    if (!session) {
        throw redirect(302, handleLoginRedirect({ url }))
    }

    const entries = await db.selectFrom("Entry")
        .innerJoin("Bookmark as b", "b.entryId", "Entry.id")
        .select(["Entry.title", "Entry.id"])
        .where("author", "=", person)
        .where("b.userId", "=", session.userId)
        .execute();



    return {
        entries,
        person,
        lazy: {
            // promises
            movies: tmdb.person.search(person),
        }
    }

}