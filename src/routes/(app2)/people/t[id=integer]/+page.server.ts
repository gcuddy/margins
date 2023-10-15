import { tmdb } from "$lib/api/tmdb";

export async function load({ params }) {
    const { id } = params;
    console.log({ id })
    return {
        person: tmdb.person.details(+id)
    }
}