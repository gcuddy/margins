import { db } from "$lib/db";
import { types } from "$lib/types";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";
import { z } from "zod";

export const inputSchema = z.object({
    take: z.coerce.number().int().min(1).max(100).default(25),
    cursor: z.object({
        updatedAt: z.coerce.date(),
        sort_order: z.number(),
    }).optional(),
    userId: z.string(),
    status: z.enum(["Backlog", "Now", "Archive"]),
    filter: z.object({
        type: z.enum(types),
        search: z.string().optional()
    }).partial().optional()
})

export type ListInput = z.infer<typeof inputSchema>;

export async function fetchList({ take = 25, cursor, userId, status, filter }: z.infer<typeof inputSchema>) {
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
            "b.updatedAt",
            "e.wordCount",
            "e.spotifyId",
            "b.status",
            "b.sort_order",
            "i.progress",
            "i.currentPage"
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
        .orderBy("b.sort_order", "asc")
        .orderBy("b.updatedAt", "desc")
        .limit(take + 1)
    if (cursor) {
        query = query.where("b.sort_order", ">=", cursor.sort_order);
        query = query.where("b.updatedAt", "<", cursor.updatedAt);
    }
    if (filter) {
        if (filter.type) {
            query = query.where("e.type", "=", filter.type);
        }
        if (filter.search) {
            query = query.where("e.title", "like", `%${filter.search}%`);
        }
    }
    const entries = await query.execute();
    let nextCursor: typeof cursor | undefined = undefined;
    console.log(entries.length, take)
    if (entries.length > take) {
        const nextItem = entries.pop();
        nextCursor = {
            updatedAt: nextItem!.updatedAt,
            sort_order: nextItem!.sort_order
        };
    }
    console.timeEnd("fetchList");
    return { entries, nextCursor };
}