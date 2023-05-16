import type { EntryInList } from "$lib/db/selects";
import type { Entry } from "@prisma/client";

export function getId(entry: Pick<Entry, "type" | "id" | "tmdbId" | "googleBooksId" | "spotifyId" | "podcastIndexId"> | EntryInList): string | number {
    if ((entry.type === "movie" || entry.type === "tv") && entry.tmdbId) {
        return entry.tmdbId;
    }
    if (entry.type === "book" && entry.googleBooksId) {
        return entry.googleBooksId;
    }
    if (entry.type === "album" && entry.spotifyId) {
        return entry.spotifyId;
    }
    if (/*entry.type === "podcast" && */ entry.podcastIndexId) {
        return "p" + Number(entry.podcastIndexId).toString();
    }
    return entry.id;
}

export function getType(type: Entry["type"]) {
    if (type === "rss") return "article";
    return type
}