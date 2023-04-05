import { normalizeUrl } from "$lib/feeds/utils";
import type { Feed } from "@prisma/client";
import parse from "node-html-parser";
import type Parser from "rss-parser";

type Item = {
    [key: string]: any;
} & Parser.Item;


const isRedirect = (status: number) =>
    status === 301 ||
    status === 302 ||
    status === 303 ||
    status === 307 ||
    status === 308;

export async function followUrl(url: string | undefined) {
    if (!url) return undefined;
    const normalized_url = normalizeUrl(url)
    const res = await fetch(normalized_url);
    if (isRedirect(res.status)) {
        const location = res.headers.get("location");
        if (!location) {
            console.error(`${url} responded with status ${res.status} but no location header`);
            return url;
        }
        return location;
    } else {
        return res.url;
    }
}

// TODO: adapter for RSS, Atom, JSON Feed

export async function adaptEntryFromItem(item: Item, feedId: Feed["id"]) {
    const enclosureUrl = item.enclosure?.url;
    const type = item.enclosure?.type === "audio/mpeg" ? "audio" : "article" as const;
    let image: string | undefined = undefined;
    if (item.content) {
        const root = parse(item.content);
        const img = root.querySelector("img");
        if (img) {
            image = img.getAttribute("src");
            // TODO: queue this image for download
        }
    }
    const html = item["content:encoded"] ?? item.content ?? null;
    console.log({ html })
    return ({
        feedId,
        title: item.title ?? null,
        uri: await followUrl(item.link ?? enclosureUrl) ?? null,
        guid: item.guid ?? null,
        published: item.pubDate ? new Date(item.pubDate) : item.isoDate ? new Date(item.isoDate) : null,
        author: (item.author || item["dc:creator"] || item.itunes?.author) ?? null,
        html,
        updatedAt: new Date(),
        image,
        type,
        enclosureUrl: type === "audio" ? enclosureUrl : null,
    }) as const
}
