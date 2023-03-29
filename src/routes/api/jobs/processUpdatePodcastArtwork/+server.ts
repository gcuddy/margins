import { client } from '$lib/features/podcasts/podcastdx';
import { redis } from '$lib/redis';
import { QUEUE_LIST, QUEUE_SET, getImagesAndUpload, getPodcastImagesToProcess } from '$lib/rss/feed-images.server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const queue = await getPodcastImagesToProcess();
        console.log(queue);
        const podcasts = await Promise.all(queue.map(async (feed) => {
            const data = await client.podcastById(feed.podcastIndexId);
            const image = data.feed.artwork || data.feed.image;
            // Remove the feed from the queue
            const pipeline = redis.pipeline();
            pipeline.lrem(QUEUE_LIST, 0, feed);
            pipeline.srem(QUEUE_SET, feed.id.toString());
            await pipeline.exec();
            if (image) {
                return {
                    imageUrl: image,
                    id: feed.id,
                }
            }
        }));
        await getImagesAndUpload(podcasts.filter(Boolean));
        return json({ message: "ok" })
    } catch (e) {
        console.error(e);
        throw error(500)
    }
};
