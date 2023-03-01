// refresh feeds using interactive transactions via prismas

// questions about how to scale this/whether i need some sort of job thingy

// for now let's just write out the basics.
import { Prisma } from "@prisma/client";
import { XMLParser } from "fast-xml-parser";
import parse from "node-html-parser";

import { db } from "$lib/db";
import { parseEntry } from "$lib/feeds/parser";
import { resolveUrl } from "$lib/feeds/utils";
import { isXml } from "$lib/rss/utils";


const log = (msg: string) => console.log(`[refreshFeeds] - ${msg}`);

// TODO: type for this
export const feedSelect = Prisma.validator<Prisma.FeedSelect>()({
    feedUrl: true,
    id: true,
    entries: {
        // some sort of public id. right nwo that's the uri but obviously that's a bit naive
        select: {
            uri: true,
            guid: true,
        },
    },
    _count: {
        select: {
            // used to send header with subscription count
            subscriptions: true,
        },
    },
});

const typedFeedSelect = Prisma.validator<Prisma.FeedArgs>()({
    select: feedSelect,
});
type FeedToUpdate = Prisma.FeedGetPayload<typeof typedFeedSelect>;
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
});
const getLink = (link: any, ...rel: (string | undefined)[]) => {
    if (typeof link === "string") {
        return link;
    }
    if (link?.href) {
        return link.href;
    }
    if (Array.isArray(link)) {
        if (rel?.length) {
            for (const option of rel) {
                const _rel = link.find((l) => l.rel === option)?.href;
                if (_rel) {
                    return _rel;
                }
            }
        } else {
            return link[0].href;
        }
    }
    return "";
};

function hmsToSecondsOnly(str: string) {
    const p = str.split(':');
    let s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}


export const getImageFromHtml = (html: string, baseUrl: string) => {
    if (!html) {
        return undefined;
    }
    try {
        const doc = parse(html);
        let img: string | undefined = undefined;
        doc.querySelectorAll("img, iframe, video").forEach((el) => {
            // TODO next... get first image (pass into other stuff)
            if (img) {
                return img;
            }
            switch (el.tagName) {
                case "IMG": {
                    img = el.getAttribute("src");
                    break;
                }
                case "IFRAME": {
                    img = el.getAttribute("src");
                    break;
                }
                case "VIDEO": {
                    img = el.getAttribute("poster");
                    break;
                }
            }
        });
        if (img) {
            img = resolveUrl(baseUrl, img);
        }
        return img;
    } catch (e) {
        console.error(e);
        return undefined
    }
};

const getText = (...items: any): string => {
    for (const item of items) {
        if (typeof item === "string") {
            return item;
        }
        if (item?.["#text"]) {
            return item["#text"] as string;
        }
        if (Array.isArray(item)) {
            return item.map((i) => getText(i)).join(", ") as string;
        }
    }
    return "";
};
export async function refresh({ feed_ids }: { feed_ids?: number[] }) {
    const feeds = await db.feed.findMany({
        where: {
            active: true,
            subscriptions: {
                some: {},
            },
            // TODO: allow passing in full feeds instead of ids to prevent extra db call
            id: feed_ids ? {
                in: feed_ids,
            } : undefined,
        },
        select: feedSelect,
    });
    console.time(`[refreshFeeds] - toAdd`);
    const toAdd = await Promise.all(
        feeds
            .flatMap(async (feed) => {
                const entries = getUpdatedEntries(feed);
                if (entries) {
                    return entries;
                } else {
                    return [{}];
                }
                // return db.entry.createMany({
                // 	skipDuplicates: true,
                // 	data: entries || [],
                // });
            })
            .filter((f) => f)
    );
    // TODO: better flatmap magic
    const entriesToAdd = toAdd.flat().filter((a) => a) as ReturnType<typeof createEntry>[];
    console.log({ toAdd, entriesToAdd });
    console.timeEnd(`[refreshFeeds] - toAdd`);
    try {
        const created = await db.entry.createMany({
            skipDuplicates: true,
            data: entriesToAdd,
        });
        console.log({ created });
        return created;
    } catch (e) {
        console.error(e);
    }
}

// hoist this
function parseXml(xml: string) {
    const parsedXml = parser.parse(xml);
    return parsedXml;
}

// : Promise<Prisma.EntryCreateManyInput>
async function getUpdatedEntries(feed: FeedToUpdate) {
    const uris = feed.entries.map((e) => e.uri).filter((e) => e) as string[];
    const guids = feed.entries.map((e) => e.guid).filter((e) => e) as string[];
    // https://github.com/podverse/podcast-feed-parser/blob/develop/index.js for nice idea
    if (!feed.feedUrl) {
        return;
    }
    try {
        const response = await fetch(feed.feedUrl);
        const body = await response.text();
        const contentType = response.headers.get("content-type");
        console.log(`checking for updates in ${feed.feedUrl}`);
        if ((contentType && isXml(contentType)) || body.trim().startsWith("<?xml")) {
            // If the type is XML...
            const parsed = parseXml(body);
            const podcast = parsed.rss?.['xmlns:itunes'] === 'http://www.itunes.com/dtds/podcast-1.0.dtd';
            console.log({ podcast })
            const data = parsed.rss?.channel || parsed.feed;
            const itemsToProcess = (data.items || data.item || data.entry)
            const items: ReturnType<typeof createEntry>[] = (data.items || data.item || data.entry)
                .slice(0, 30)
                // filter out items we already have
                // TODO: in future, don't do this and instead check for updates
                .filter((item) => {
                    const uri = getLink(item.link || item.enclosure?.url);
                    if (uris.includes(uri)) {
                        return false;
                    }
                    let guid: string | undefined = undefined;
                    if (item.guid) {
                        guid = getText(item.guid);
                    } else if (item.id) {
                        guid = getText(item.id);
                    }
                    if (guid && guids.includes(guid)) {
                        return false;
                    }
                    return true;
                })
                .map((entry) => {
                    // SEE: duplicated in parseEntry now, import from there in feeds/parrser
                   return parseEntry(entry, podcast, feed.id)
                    // console.log(`processing entry`, entry.title)
                    // let guid: string | undefined = undefined;
                    // if (entry.guid) {
                    //     guid = getText(entry.guid);
                    // } else if (entry.id) {
                    //     guid = getText(entry.id);
                    // }
                    // console.log(`guid`, guid)
                    // const published = entry.published || entry.pubDate || entry.pubdate || entry.updated;
                    // const description = getText(entry.summary, entry.description);
                    // const html = getText(entry.content, entry["content:encoded"]) || description;
                    // const link = getLink(entry.link);
                    // console.log(`link`, link)
                    // const enclosureUrl = entry.enclosure?.url;
                    // const duration = typeof entry["itunes:duration"] === "number" ? entry["itunes:duration"] : hmsToSecondsOnly(entry["itunes:duration"]);
                    // console.log('duration', duration)
                    // // convert to seconds
                    // // if (duration) {
                    // //     const [hours, minutes, seconds] = duration.split(':').map(Number)
                    // //     duration = (hours * 60 * 60 + minutes * 60 + seconds)
                    // // }
                    // const finalEntry = {
                    //     title: getText(entry.title),
                    //     type: podcast ? DocumentType.audio : DocumentType.article,
                    //     uri: link || enclosureUrl,
                    //     image: getLink(entry["itunes:image"]) || getImageFromHtml(entry.content, link),
                    //     guid,
                    //     html,
                    //     published: dayjs(published).isValid() ? dayjs(published).format() : undefined,
                    //     updated: entry.updated,
                    //     enclosureUrl,
                    //     duration,
                    //     author: getText(entry.author?.name || entry["itunes:author"] || ''),
                    //     summary: html === description ? undefined : description,
                    //     feedId: feed.id
                    //     // TODO: episode no., ordering
                    // }
                    // // const finalEntry = createEntry(feed.id, {
                    // // 	title: getText(entry.title),
                    // // 	type: podcast ? DocumentType.audio : DocumentType.article,
                    // // 	uri: link || enclosureUrl,
                    // // 	image: getImageFromHtml(entry.content, link),
                    // // 	guid,
                    // // 	html,
                    // // 	published: dayjs(published).isValid() ? dayjs(published).format() : undefined,
                    // // 	updated: entry.updated,
                    // //     enclosureUrl,
                    // //     duration,
                    // // 	author: getText(entry.author?.name),
                    // // 	summary: html === description ? undefined : description,
                    // // });
                    // console.log("final entry");
                    // return finalEntry;
                });
            console.log(`found ${items?.length} items in ${feed.feedUrl}`);
            return items;
        } else {
            return [];
        }
    } catch (e) {
        console.error("Error fetching feed: " + feed.feedUrl + " " + e);
        return;
    }
}

const createEntry = (
    feedId: number,
    { title, type, uri, guid, html, published, updated, author, summary, enclosureUrl, duration }: Prisma.EntryCreateInput
) => {
    return Prisma.validator<Prisma.EntryCreateManyInput>()({
        title,
        type,
        uri,
        guid,
        html,
        published,
        updated,
        author,
        summary,
        enclosureUrl,
        duration,
        feedId,
    });
};
