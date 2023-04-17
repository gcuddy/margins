import { db } from "$lib/db";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";
import { z } from "zod";

export const inputSchema = z.object({
    take: z.coerce.number().int().min(1).max(100).default(25),
    cursor: z.coerce.date().nullish(),
    userId: z.string(),
    status: z.enum(["Backlog", "Now", "Archive"])
})

export async function fetchList({ take, cursor, userId, status }: z.infer<typeof inputSchema>) {
    console.time("fetchList");
    // select e.id, e.title, e.published, e.uri, e.feedId, e.image, e.duration, e.enclosureUrl, s.title as feed_title, f.podcastIndexId as feed_pindex, f.imageUrl as feed_image from Entry as e join Feed as f on f.id = e.feedId join Subscription as s on s.feedId = f.id and s.userId = 'kvDQosqGkyqwGwo' order by e.published desc limit 25;
    let query = db
        .selectFrom("Bookmark as b")
        .innerJoin("Entry as e", "e.id", "b.entryId")
        .leftJoin("EntryInteraction as i", (j) =>
            j.onRef("i.entryId", "=", "e.id").on("i.userId", "=", userId)
        )
        .select([
            "e.id",
            "e.image",
            "e.published",
            "e.type",
            "e.title",
            "e.author",
            "e.uri",
            "e.tmdbId",
            "e.googleBooksId",
            "e.podcastIndexId",
            "b.status"
        ])
        .select((eb) => [
            jsonArrayFrom(eb.selectFrom("Annotation")
                .select(["Annotation.id", "Annotation.contentData"])
                .whereRef("Annotation.entryId", "=", "e.id")
            ).as("annotations"),
            jsonObjectFrom(eb.selectFrom("EntryInteraction as i")
                .select(["i.progress"])
                .whereRef("i.entryId", "=", "e.id")
                .where("i.userId", "=", userId)
            ).as("interaction"),
        ])
        .where("b.userId", "=", userId)
        .where("b.status", "=", status)
        .orderBy("b.createdAt", "desc")
        .limit(take)
    if (cursor) {
        query = query.where("e.published", "<", cursor);
    }
    const entries = await query.execute();
    let nextCursor: typeof cursor | undefined = undefined;
    if (entries.length > take) {
        const nextItem = entries.pop();
        nextCursor = nextItem!.published;
    }
    console.timeEnd("fetchList");
    return { entries, nextCursor };
}