import { uploadFile } from "$lib/backend/s3.server";
import { db } from "$lib/db";
import { redis } from "$lib/redis";

async function fetchImage(imageUrl: string) {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer);
}

export async function getPodcastsWithoutS3Image() {
    const podcasts = await db.selectFrom("Feed")
        .select(["imageUrl", "id"])
        .where("imageUrl", "is not", null)
        .where("imageUrl", "like", "http%")
        .execute();
    return podcasts.map((podcast) => ({ imageUrl: podcast.imageUrl as string, id: podcast.id })).filter(Boolean);
}


export async function getImagesAndUpload(podcasts: { imageUrl: string, id: number }[]) {
    const paths = await Promise.all(podcasts.map(async ({ imageUrl: image, id }) => {
        const url = new URL(image);
        url.search = "";
        const cleanedUrl = url.toString();
        console.log({ cleanedUrl })
        const res = await fetch(cleanedUrl);
        const ContentType = res.headers.get("content-type") || res.headers.get("Content-Type") || "image/jpeg";
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(cleanedUrl));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        const extension = ContentType.split("/")[1];
        const Key = `images/feeds/${hashHex}.${extension}`
        await uploadFile({
            Key,
            Body: buffer,
            ContentType
        });
        return {
            id,
            path: Key
        };
    }));
    // now take our new paths and update the database
    await Promise.all(paths.map(async ({ id, path }) => {
        await db.updateTable("Feed")
            .set({ imageUrl: path })
            .where("id", "=", id)
            .execute();
    }));
}

export const QUEUE_LIST = "queue:podcast_artwork";
export const QUEUE_SET = "queued_podcast_artwork";
export function getPodcastImagesToProcess(num = -1,): Promise<{
    id: number;
    podcastIndexId: number;
    imageUrl: string | null;
}[]> {
    return redis.lrange(QUEUE_LIST, 0, num);
}
