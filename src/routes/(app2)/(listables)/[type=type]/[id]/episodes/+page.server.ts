import { tmdb } from '$lib/api/tmdb';
import { error } from '@sveltejs/kit';

export async function load({ params, url, parent }) {
    if (params.type.toLowerCase() !== "tv") throw error(404);
    const season_num = parseInt(url.searchParams.get('season') ?? "1");

    return {
        season: tmdb.tv.season(+params.id, season_num)
    }
}