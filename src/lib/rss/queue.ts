// rss subscription queue implemented in redis

import type { Redis } from "@upstash/redis";
import { config, db } from "$lib/db"
import Parser from 'rss-parser';
import { connect } from "@planetscale/database";

const parser = new Parser();

const conn = connect(config);

export function addToQueue(redis: Redis, feedUrl: string) {
    return redis.rpush("queue:feeds", feedUrl);
}

export function getFeedsToProcess(redis: Redis, num = -1,): Promise<{ feedUrl: string, id: number }[]> {
    return redis.lrange("queue:feeds", 0, num);
}

export const getFeedUrlsFromDatabase = async () => {
    const feeds = await
        db.selectFrom("Feed as f")
            .select(["f.feedUrl", "f.id"])
            .where("f.feedUrl", "is not", null)
            .execute();
    return feeds.map((feed) => ({ feedUrl: feed.feedUrl as string, id: feed.id })).filter(Boolean);
}

export async function getFeedText(feedUrl: string) {
    const text = await fetch(feedUrl).then((res) => res.text());
    return text;
}


export async function processFeed(redis: Redis, { feedUrl, id: feedId }: { feedUrl: string, id: number }) {
    try {
        const lastProcessedItemId = await redis.get(`last_processed_item:${feedUrl}`);
        const text = await getFeedText(feedUrl);
        // now parse feed text
        const feed = await parser.parseString(text);
        // console.log(feed)

        // if lastProcessedItemId is undefined, then we want to process the first 50 items. otherwise, process everything *up to* the lastProcessedItemId
        let slice = lastProcessedItemId ? [0, feed.items.findIndex(i => i.guid === lastProcessedItemId || i.link === lastProcessedItemId)] : [0, 50];

        const newItems = feed.items.slice(...slice).filter((item) => {
            if (lastProcessedItemId && (item.guid === lastProcessedItemId || item.link === lastProcessedItemId)) {
                return false;
            }
            return true;
        });
        // If there are no new items, return early
        if (newItems.length === 0) {
            return;
        }
        console.log(`Processing ${newItems.length} new items for ${feedUrl}...`)
        // Store the GUID of the last processed item for this feed
        const pipeline = redis.pipeline();
        pipeline.set(`lastProcessedItem:${feedUrl}`, newItems[0].guid || newItems[0].link);
        // Add the new items to the database
        const itemsToAdd = await Promise.all(newItems.map(async item => {
            // Use the GUID or URL as the unique identifier for each item
            const uniqueId = item.guid || item.link;
            let exists = !!uniqueId;
            if (exists) {
                const existsQuery = await conn.execute(`SELECT 1 FROM Entry e where e.feedId = ? and (e.guid = ? or e.uri = ?)`, [feedId, item.guid, item.uri]);
                existsQuery.rows.length > 0 ? exists = true : exists = false;
            }
            if (!exists) {
                console.log("inserting", item.link)
                // await conn.execute(`INSERT INTO Entry (feedId, title, uri, guid, published, author, html) VALUES (?, ?, ?, ?)`, [feedId, item.title ?? null, item.link ?? null, item.guid ?? null, item.pubDate ? new Date(item.pubDate) : null, item.author ?? null, item.content ?? null]);
                return item;
            }
            // console.log({ exists })
        }));
        const new_items = itemsToAdd.filter(Boolean);
        await pipeline.exec();

        // TODO: think about getting from podcastindex instead of rss feed for nice data

        // TODO: Podcast etc
        await db.insertInto("Entry").values(new_items.map(item => {

            const enclosureUrl = item.enclosure?.url;
            const type = item.enclosure?.type === "audio/mpeg" ? "audio" : "article" as const;
            return ({
                feedId,
                title: item.title ?? null,
                uri: item.link ?? enclosureUrl ?? null,
                guid: item.guid ?? null,
                published: item.pubDate ? new Date(item.pubDate) : item.isoDate ? new Date(item.isoDate) : null,
                author: (item.author || item["dc:creator"] || item.itunes?.author) ?? null,
                html: item.content ?? null,
                updatedAt: new Date(),
                type,
                enclosureUrl,
            }) as const
        })).onDuplicateKeyUpdate({
            feedId,
        }).execute();
    } catch (e) {
        console.error(e);
        // TODO
    }
}

export async function processFeeds(redis: Redis) {
    try {
        // Get the next 100 feeds from the queue
        console.time("processFeeds")
        console.time("getFeedsToProcess")
        const feeds = await getFeedsToProcess(redis, 40);
        console.timeEnd("getFeedsToProcess")
        console.log("feeds", feeds);
        // Process each feed in parallel
        await Promise.all(feeds.map(async (feed) => {
            await processFeed(redis, feed);
            // Remove the feed from the queue
            const pipeline = redis.pipeline();
            pipeline.lrem("queue:feeds", 0, feed);
            pipeline.srem("queued_feeds", feed.feedUrl);
            await pipeline.exec();
            console.log("Processed feed", feed.feedUrl)
        }))
        console.timeEnd("processFeeds")
        console.log("all done")
    } catch (e) {
        // TODO
    }
}
