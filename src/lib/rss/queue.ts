// rss subscription queue implemented in redis

import type { Redis } from "@upstash/redis";
import { config, db } from "$lib/db"
import { getFeedText } from "$lib/rss/utils";
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


type LastProcessed = {
    last_processed_id: string | null;
    last_processed_date: string | null;
} | null;

export async function processFeed(redis: Redis, { feedUrl, id: feedId }: { feedUrl: string, id: number }) {
    try {
        const lastProcessedItem = await redis.get(`last_processed_item:${feedUrl}`) as LastProcessed;
        console.log(`Attempting to process feed ${feedUrl}. Last processed item: `, lastProcessedItem)
        const text = await getFeedText(feedUrl);
        // now parse feed text
        const feed = await parser.parseString(text);
        // console.log(feed)



        // if lastProcessedItemId || lastProcessedDate is undefined, then we want to process the first 50 items. otherwise, process everything *up to* the lastProcessedItemId
        let slice = [0, 50];
        if (lastProcessedItem?.last_processed_id || lastProcessedItem?.last_processed_date) {
            const index = feed.items.filter(Boolean).findIndex((item) => {
                if (lastProcessedItem?.last_processed_id && (item.guid === lastProcessedItem?.last_processed_id || item.link === lastProcessedItem?.last_processed_id || item.enclosure?.url === lastProcessedItem?.last_processed_id)) {
                    return true;
                }
                if (lastProcessedItem?.last_processed_date && item.isoDate === lastProcessedItem?.last_processed_date) {
                    return true;
                }
                return false;
            });
            console.log(`last processed index for ${feedUrl}`, index)
            if (index > -1) {
                slice = [0, index];
            }
        }

        console.log("slice", slice)

        // console.log(`Here's the first item of: ${feedUrl}`, feed.items[0])


        const newItems = feed.items.slice(...slice).filter((item) => {
            if (lastProcessedItem?.last_processed_id && (item.guid === lastProcessedItem?.last_processed_id || item.link === lastProcessedItem?.last_processed_id || item.enclosure?.url === lastProcessedItem?.last_processed_id)) {
                return false;
            }
            return true;
        });
        // If there are no new items, return early
        if (newItems.length === 0) {
            console.log(`No new items for ${feedUrl}.`)
            return;
        }
        console.log(`Processing ${newItems.length} new items for ${feedUrl}...`);
        // console.log(`Again, here's the first item of: ${feedUrl}`, newItems[0])
        // Store the GUID of the last processed item for this feed
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
        console.log(`Actually adding ${itemsToAdd.length} new items for ${feedUrl}...`)
        const new_items = itemsToAdd.filter(Boolean);
        console.log(`*Actually* adding ${new_items.length} new items for ${feedUrl}...`)
        // console.log(`Here's the first item for ${feedUrl}`, { itemsToAdd: itemsToAdd[0], new_items: new_items[0] })
        if (new_items.length === 0) {
            if (!lastProcessedItem || !lastProcessedItem.last_processed_id || !lastProcessedItem.last_processed_date) {
                const uniqueId = feed.items[0].guid || feed.items[0].link || feed.items[0].enclosure?.url;
                const date = feed.items[0].isoDate || feed.items[0].pubDate;
                console.log(`No new items for ${feedUrl}, but no lastProcessedItem values set. Setting last processed item to the first item in the feed. Using values: `, { uniqueId, date })
                // set the last processed item to the first item in the feed so that we can fail faster next time
                await redis.set(`last_processed_item:${feedUrl}`, {
                    last_processed_id: uniqueId,
                    last_processed_date: date,
                });
                return;
            }
            console.log(`No new items for ${feedUrl}.`)
            return;
        }
        await redis.set(`last_processed_item:${feedUrl}`, {
            last_processed_id: new_items[0].guid || new_items[0].link || new_items[0].enclosure?.url,
            last_processed_date: new_items[0].isoDate,
        });
        // TODO: think about getting from podcastindex instead of rss feed for nice data

        // TODO: Podcast etc
        console.log(`Inserting ${new_items.length} new items for ${feedUrl}...`)
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
        // 40 feeds takes ~30 seconds
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
            // console.log("Processed feed", feed.feedUrl)
        }))
        console.timeEnd("processFeeds")
        console.log("all done")
    } catch (e) {
        // TODO
    }
}
