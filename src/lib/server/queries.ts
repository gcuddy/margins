import { db } from "$lib/db"
import type { Type } from "$lib/types";
import type { Status } from "@prisma/client";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";

export async function get_library(userId: string, status: Status, filter: {
    type?: Type,
    search?: string
} = {}, cursor?: { sort_order: number, updatedAt: Date }) {
    const take = 25
    console.log(`[get_library]`, { cursor, filter })
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
            jsonArrayFrom(eb.selectFrom("Tag")
                .select(["Tag.id", "Tag.name"])
                .innerJoin("TagOnEntry as et", "et.tagId", "Tag.id")
                .whereRef("et.entryId", "=", "e.id")
            ).as("tags")
        ])
        .where("b.userId", "=", userId)
        .where("b.status", "=", status)
        .orderBy("b.sort_order", "asc")
        .orderBy("b.updatedAt", "desc")
        .limit(take + 1)
    if (cursor) {
        console.log(`adding cursor`)
        query = query.where("b.sort_order", ">=", cursor.sort_order);
        query = query.where("b.updatedAt", "<", cursor.updatedAt);
    }
    if (filter.search) {
        query = query.where("e.title", "like", `%${filter.search}%`);
    }
    if (filter.type) {
        query = query.where("e.type", "=", filter.type);
    }
    const entries = await query.execute();
    let next = null;
    if (entries.length > take) {
        const nextItem = entries.pop();
        if (nextItem) {
            next = {
                updatedAt: nextItem.updatedAt,
                sort_order: nextItem.sort_order
            };
        }
    }
    return {
        entries,
        next
    }
}


export type LibraryResponse = Awaited<ReturnType<typeof get_library>>;