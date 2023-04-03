import type { Feed } from "@prisma/client";
import parse from "node-html-parser";
import type Parser from "rss-parser";

type Item = {
    [key: string]: any;
} & Parser.Item;

// TODO: adapter for RSS, Atom, JSON Feed

export function adaptEntryFromItem(item: Item, feedId: Feed["id"]) {
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
        uri: item.link ?? enclosureUrl ?? null,
        guid: item.guid ?? null,
        published: item.pubDate ? new Date(item.pubDate) : item.isoDate ? new Date(item.isoDate) : null,
        author: (item.author || item["dc:creator"] || item.itunes?.author) ?? null,
        html,
        updatedAt: new Date(),
        image,
        type,
        enclosureUrl,
    }) as const
}
