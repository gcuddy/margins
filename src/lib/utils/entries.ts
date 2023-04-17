import type { Entry } from "@prisma/client";

export function getId(entry: Pick<Entry, "id" | "type" | "tmdbId" | "googleBooksId" | "podcastIndexId">): string | number {
    if ((entry.type === "movie" || entry.type === "tv") && entry.tmdbId) {
        return entry.tmdbId;
    }
    if (entry.type === "book" && entry.googleBooksId) {
        return entry.googleBooksId;
    }
    if (/*entry.type === "podcast" && */ entry.podcastIndexId) {
        return "p" + Number(entry.podcastIndexId);
    }
    return entry.id;
}
