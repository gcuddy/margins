import { redis } from '$lib/redis';
import { processFeeds } from '$lib/rss/queue';
import type { Config } from '@sveltejs/adapter-vercel';
import type { RequestHandler } from './$types';

export const config: Config = {
    runtime: "nodejs18.x",
    split: true
}

export const GET: RequestHandler = async () => {
    await processFeeds(redis);
    return new Response();
};
