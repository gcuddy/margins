import { redis } from '$lib/redis';
import { addToQueue, getFeedUrlsFromDatabase } from '$lib/rss/queue';
import type { RequestHandler } from './$types';
import { error, json } from "@sveltejs/kit"
import type { Config } from '@sveltejs/adapter-vercel';
export const config: Config = {
    runtime: "nodejs18.x",
    split: true
}

export const GET: RequestHandler = async ({ url }) => {
    // verify key is correct
    const key = url.searchParams.get("key");
    if (key !== "xxItiwHxkYOfv5GW/BzyCc80EnpFu1ByZCmNe4UkSaw=") {
        throw error(401, "Not authorized")
    }
    try {
        const feeds = await getFeedUrlsFromDatabase();
        console.log({ feeds })
        const pipeline = redis.pipeline();
        const queuedFeeds = new Set(await redis.smembers("queued_feeds"));
        console.log(queuedFeeds)
        const feedsToQueue = feeds.filter((feed) => !queuedFeeds.has(feed.feedUrl));
        if (feedsToQueue.length > 0) {
            for (const feed of feedsToQueue) {
                pipeline.rpush("queue:feeds", feed)
                pipeline.sadd("queued_feeds", feed.feedUrl);
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
};
