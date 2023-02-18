import { DocumentType, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { XMLParser } from "fast-xml-parser";
import parse from "node-html-parser";
import { z } from "zod";

import { db } from "$lib/db";
import { getImageFromHtml } from "$lib/jobs/refresher";
import { jsonFeedSchema } from "$lib/types/schemas/feeds";
import { stripEmptyTags } from "$lib/utils/sanitize";

import { subscriptionApiSelect } from "./types";
import { getLink, getText, isJson, isXml, linkSelectors, normalizeUrl, resolveUrl } from "./utils";

export interface Feed {
	input: string;
	favicon?: string;
	feeds: {
		url: string;
		title: string;
	}[];
}
const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "",
});

/**
 *
 * @param feedUrl the url to try to find feeds for
 * @param _fetch Sveltekit-scoped fetch
 * @returns An array of feeds
 */
export async function findFeed(feedUrl: string): Promise<{
	input: string;
	favicon?: string;
	feeds: {
		url: string;
		title: string;
	}[];
}> {
	try {
		// First, normalize URL.
		const url = new URL(normalizeUrl(feedUrl));
		console.log({ url: url.toString(), feedUrl });
		const response = await fetch(url, {
			method: "GET",
			// TODO: headers saying we come in peace
		});
		console.log({ response });
		if (!response.ok) {
			console.error("Could not find feed.");
			return {
				input: feedUrl,
				feeds: [],
			};
		}
		const body = await response.text();
		const contentType = response.headers.get("content-type");
		if ((contentType && isXml(contentType)) || body.trim().startsWith("<?xml")) {
			// We're in XML land
			const parsed = parser.parse(body);
			const data = parsed.rss?.channel || parsed.feed;
			const title = getText(data?.title);
			const image = data?.image?.url || data?.icon;
			return {
				input: feedUrl,
				favicon: image || `https://icon.horse/icon/?uri=${feedUrl}`,
				feeds: [
					{
						title,
						url: feedUrl,
					},
				],
			};
		} else if (contentType && isJson(contentType)) {
			try {
				console.log({ body });
				const parsed = JSON.parse(body);
				const { title, icon, feed_url } = parsed;
				return {
					input: feedUrl,
					favicon: icon || `https://icon.horse/icon/?uri=${feedUrl}`,
					feeds: [
						{
							title,
							url: feed_url,
						},
					],
				};
			} catch {
				console.error("failed parsing JSON Feed");
				return {
					input: feedUrl,
					feeds: [],
				};
			}
		} else {
			// The URL was not XML or JSON — so let's try to find the feed now
			const root = parse(body);
			const links = root
				.querySelectorAll(linkSelectors)
				.map((l) => l.attributes.href)
				.filter((l) => l);
			if (!links.length) {
				// try /feed as a last ditch effort
				if (!feedUrl.endsWith("/feed")) {
					// const newUrlToTry = new URL('/feed', feedUrl);
					// return findFeed(newUrlToTry.href);
				} else {
					return {
						input: feedUrl,
						feeds: [],
					};
				}
			}
			// for (const link of links) {
			// 	const resolved = resolveUrl(url.toString(), link);
			// 	console.log(`trying to fetch ${resolved}`);
			// 	console.log(await findFeed(resolveUrl(url.toString(), link)));
			// }
			console.log(`Found ${links.length} links to check!`);
			console.time("feedCrawl");
			const allFeeds = await Promise.all(
				links.map(async (link) => {
					return findFeed(resolveUrl(feedUrl, link));
				})
			);
			console.timeEnd("feedCrawl");
			console.log({ allFeeds });
			const favicon = allFeeds.find((f) => {
				if (!f.favicon) return false;
				if (f.favicon.startsWith("https://icon.horse")) return false;
				return true;
			})?.favicon;
			return {
				input: feedUrl,
				favicon,
				feeds: allFeeds.flatMap((f) => f.feeds),
			};
		}
	} catch (e) {
		console.error(e);
		return {
			input: feedUrl,
			feeds: [],
		};
	}
}

// todo: put this somewhere else
const feedsToAdd = z.object({
	feeds: z.array(z.object({ url: z.string().url(), title: z.string() })),
});

function parseXml(xml: string) {
	const parsedXml = parser.parse(xml);
	const data = parsedXml.rss?.channel || parsedXml.feed;
	return data;
}

function getTextContent(html: string) {
	const root = parse(html);
	const textContent = root.textContent;
	return textContent;
}

const createFeedAndEntries = ({
	title,
	feedUrl,
	entries,
	lastBuildDate,
}: {
	title: string;
	feedUrl: string;
	link?: string;
	description?: string;
	imageUrl?: string;
	lastBuildDate?: string;
	creator?: string;
	entries: Prisma.Enumerable<Prisma.EntryCreateManyFeedInput>;
}) => {
	// i think it's preferred to filter out entries first, but otherwise we can still use skipduplicates
	return Prisma.validator<Prisma.FeedCreateInput>()({
		title,
		feedUrl,
		lastBuildDate,
		entries: {
			createMany: {
				skipDuplicates: true,
				data: entries,
			},
		},
	});
};

export const addSubscription = async ({
	feedUrl,
	userId,
	title,
}: {
	feedUrl: string;
	title: string;
	userId: string;
}) => {
	// todo: somehow have this cached so i don't have to re-fetch on search/add
	const response = await fetch(feedUrl);
	const body = await response.text();
	// data should be xml
	const contentType = response.headers.get("content-type");
	let data: ReturnType<typeof createFeedAndEntries> | undefined = undefined;
	if ((contentType && isXml(contentType)) || body.trim().startsWith("<?xml")) {
		const feed = parseXml(body);
		const description = getText(feed.description, feed.subtitle);
		data = createFeedAndEntries({
			title: getText(feed.title) || "",
			description: description ? stripEmptyTags(description) : "",
			imageUrl: (feed.image?.url as string) || "",
			feedUrl: feed.feed_url || feedUrl,
			// TODO: types
			entries: (feed.items || feed.item || feed.entry || []).slice(0, 20).map((entry: any) => {
				let guid: string | undefined = undefined;
				if (entry.guid) {
					guid = getText(entry.guid);
				} else if (entry.id) {
					guid = getText(entry.id);
				}
				const published = entry.published || entry.pubDate || entry.pubdate || entry.updated;
				const description = getText(entry.summary, entry.description);
				const html = getText(entry.content, entry["content:encoded"]) || description;
				const link = getLink(entry.link);
				return {
					title: getText(entry.title),
					type: DocumentType.article,
					image: getImageFromHtml(html, link),
					uri: link,
					guid,
					html,
					text: getTextContent(html),
					published: dayjs(published).isValid() ? dayjs(published).format() : undefined,
					updated: entry.updated,
					author: getText(entry.author?.name),
					summary: html === description ? undefined : description,
				};
			}),
		});
	} else if (contentType && isJson(contentType)) {
		const { title, feed_url, items } = jsonFeedSchema.parse(JSON.parse(body));
		console.log(`[json feed] ${feed_url}`);
		data = createFeedAndEntries({
			title,
			feedUrl: feedUrl,
			entries: items.map((item) => {
				return {
					title: item.title,
					uri: item.url,
					type: DocumentType.article,
					published: item.date_published,
					updated: item.date_modified,
					author: item.authors?.join(", "),
					html: item.content_html,
					text: item.content_text,
				};
			}),
		});
	}
	if (!data) {
		// throw Error('Could not find feed');
		console.error("Could not find feed");
		return;
	} else if (data) {
		const feed = await db.feed.upsert({
			where: {
				feedUrl: data.feedUrl,
			},
			create: data,
			update: data,
		});
		// now create subscription
		return db.subscription.create({
			data: {
				userId,
				title,
				feedId: feed.id,
			},
			select: subscriptionApiSelect,
		});
	}
};
