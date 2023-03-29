import { getImagesAndUpload, getPodcastsWithoutS3Image } from '$lib/rss/feed-images.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const podcasts = await getPodcastsWithoutS3Image();
    console.log(podcasts);
    if (podcasts.length > 0) {
        await getImagesAndUpload(podcasts);
        console.log("fetched and uploaded images");
    }

    return json({ message: "ok" })
};
