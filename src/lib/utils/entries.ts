import { S3_BUCKET_PREFIX } from "$lib/constants";
import type { EntryInList } from "$lib/db/selects";
import type { Entry } from "@prisma/client";

const prefix = `/tests`

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

export function make_link(entry: EntryInList) {
    return `${prefix}/${getType(entry.type)}/${getId(entry)}`
}

function get_domain(url: string) {
    const domain = url.replace(/https?:\/\//, '').split('/')[0];
    return domain;
}

export function get_image(entry: {
    image?: string | null;
    uri?: string | null;
}) {
    console.log(entry.image)
    if (entry.image) {
        return entry.image?.startsWith('/')
            ? S3_BUCKET_PREFIX + entry.image.slice(1)
            : entry.image;
    } else {

        return `https://icon.horse/icon/${get_domain(entry.uri ?? '')}`
    }
}