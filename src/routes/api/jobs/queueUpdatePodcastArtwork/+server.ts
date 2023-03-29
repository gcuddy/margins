import type { RequestHandler } from './$types';
import { db } from "$lib/db"
import { redis } from '$lib/redis';
import { error, json } from '@sveltejs/kit';
import { QUEUE_LIST, QUEUE_SET } from '$lib/rss/feed-images.server';
export const GET: RequestHandler = async () => {
    try {
        const podcasts = await db.selectFrom("Feed")
            .select(["imageUrl", "id", "podcastIndexId"])
            .where("podcastIndexId", "is not", null)
            .execute();
        const pipeline = redis.pipeline();
        const queuedFeeds = new Set(await redis.smembers(QUEUE_SET));
        console.log(queuedFeeds)
        const feedsToQueue = podcasts.filter((feed) => !queuedFeeds.has(feed.id.toString()));
        if (feedsToQueue.length > 0) {
            for (const feed of feedsToQueue) {
                pipeline.rpush(QUEUE_LIST, feed)
                pipeline.sadd(QUEUE_SET, feed.id.toString());
            }
            await pipeline.exec();
            return json({ message: "ok" })
        } else {
            return json({ message: "no feeds to queue" })
        }
    } catch (e) {
        console.error(e);
        throw error(500,)
    }



    return new Response();
};
