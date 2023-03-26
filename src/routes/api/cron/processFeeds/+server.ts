import { redis } from '$lib/redis';
import { processFeeds } from '$lib/rss/queue';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    await processFeeds(redis);
    return new Response();

};
