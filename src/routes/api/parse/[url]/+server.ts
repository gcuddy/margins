import type { Config } from '@sveltejs/adapter-vercel';
import type { RequestHandler } from './$types';
import { redis } from '$lib/redis';
import type { Metadata } from '$lib/web-parser';
import { normalizeUrl } from "$lib/feeds/utils";
import parse from "$lib/parse";
import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';

// export const config: Config = {
//     runtime: "nodejs18.x"
// }

export const GET: RequestHandler = async ({ params, setHeaders }) => {
    const { url } = params;
    const cached = await redis.get(url);
    if (cached && !dev) {
        return json(cached);
    }
    // const normalizedUrl = normalizeUrl(url);
    setHeaders({
        // cache for 60 seconds
        'Cache-Control': `max-age=60`,
    })
    try {
        const parsed = await parse(url);
        if (!dev) {
            await redis.set(url, parsed, {
                // cache for one day
                ex: 60 * 60 * 24
            })
        }
        return json(parsed);
    } catch (e) {
        console.error(e)
        throw error(500)
    }
};
