import { db } from "$lib/db"
import { adaptEntryFromItem } from "$lib/rss/entries";
import { addFeedToDb, getFeed } from "$lib/rss/feed";

type Input = {
    userId: string;
    feedUrl?: string;
    feedId?: number;
    title?: string;
}
export async function addSubscription(input: Input) {
    if (!input.feedUrl && !input.feedId) {
        throw new Error("Need either feedUrl or feedId");
    }
    if (input.feedId && input.title) {
        // add subscription directly
        const subscription = await db.insertInto("Subscription")
            .values({
                userId: input.userId,
                feedId: input.feedId,
                title: input.title,
                updatedAt: new Date(),
            })
            .executeTakeFirstOrThrow();
        return {
            subscription_id: Number(subscription.insertId),
            feed_id: Number(input.feedId),
            title: input.title,
        }
    }
    let query = db.selectFrom("Feed as f")
        .select(["f.id", "f.title", "f.feedUrl"]);
    if (input.feedId) {
        query = query.where("f.id", "=", input.feedId);
    } else if (input.feedUrl) {
        query = query.where("f.feedUrl", "=", input.feedUrl);
    }
    const feed = await query.executeTakeFirst();
    if (!feed && !input.feedUrl) {
        throw new Error("No feed found with that id");
    }
    if (!feed) {
        // create it
        const feed = await getFeed(input.feedUrl!);
        const feedId = await addFeedToDb(feed);
        if (!feedId) {
            console.log({ feedId })
            throw new Error("Could not add feed to db");
        }
        const entries = feed.items.map(item => adaptEntryFromItem(item, feedId));

        // (should happen in bg)
        await db.insertInto("Entry")
            .values(entries)
            .onDuplicateKeyUpdate({
                feedId
            })
            .execute();

        // add subscription
        const subscription = await db.insertInto("Subscription")
            .values({
                feedId,
                userId: input.userId,
                title: input.title ?? feed.title ?? "[no title]",
                updatedAt: new Date()
            })
            .executeTakeFirstOrThrow();
        return {
            subscription_id: Number(subscription.insertId),
            feed_id: Number(feedId),
            title: input.title ?? feed.title,
        }

    } else {
        // add subscription
        const subscription = await db.insertInto("Subscription")
            .values({
                feedId: feed.id,
                userId: input.userId,
                title: input.title ?? feed.title ?? "[no title]",
                updatedAt: new Date()
            })
            .executeTakeFirstOrThrow();
        return {
            subscription_id: Number(subscription.insertId),
            feed_id: Number(feed.id),
            title: input.title ?? feed.title ?? undefined,
        }
    }
}
