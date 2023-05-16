type Input = {
    take: number;
    cursor?: Date | null;
    podcasts?: boolean;
    userId: string;
}
import { db } from "$lib/db";
import { entrySelect } from "$lib/db/selects";
import { z } from "zod";

export const inputSchema = z.object({
    take: z.coerce.number().int().min(1).max(100).default(25),
    cursor: z.coerce.date().nullish(),
    podcasts: z.coerce.boolean().optional(),
    userId: z.string(),
    search: z.string().optional(),
})

export async function fetchRss({ take, cursor, podcasts, userId, search }: z.infer<typeof inputSchema>) {
    console.time("fetchRss");
    // select e.id, e.title, e.published, e.uri, e.feedId, e.image, e.duration, e.enclosureUrl, s.title as feed_title, f.podcastIndexId as feed_pindex, f.imageUrl as feed_image from Entry as e join Feed as f on f.id = e.feedId join Subscription as s on s.feedId = f.id and s.userId = 'kvDQosqGkyqwGwo' order by e.published desc limit 25;
    let query = db.selectFrom("Entry as e")
        .innerJoin("Feed as f", "f.id", "e.feedId")
        .innerJoin("Subscription as s", (j) =>
            j.onRef("s.feedId", "=", "f.id").on("s.userId", "=", userId)
        )
        .select(entrySelect)
        .select(["s.title as feed_title", "f.podcastIndexId as feed_pindex", "f.imageUrl as feed_image"])
        .where("s.userId", "=", userId)
        .orderBy("e.published", "desc")
        .limit(take + 1);

    if (podcasts) {
        query = query
            .select(["e.podcastIndexId as e_pindex", "e.html"])
            .where(({ or, cmpr }) => or([
                cmpr("f.podcastIndexId", "is not", null),
                cmpr("f.podcast", "=", true),
            ]))
    }
    if (cursor) {
        // TODO: add sorting options
        query = query.where("e.published", "<", cursor);
    }
    if (search) {
        // TODO: full-text?
        query = query.where("e.title", "like", `%${search}%`);
    }
    const entries = await query.execute();
    let nextCursor: typeof cursor | undefined = undefined;
    if (entries.length > take) {
        const nextItem = entries.pop();
        nextCursor = nextItem!.published;
    }
    console.timeEnd("fetchRss");
    return { entries, nextCursor };
}