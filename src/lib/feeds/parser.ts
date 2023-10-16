import { DocumentType } from '$lib/types/enums';
import type { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { XMLParser } from 'fast-xml-parser';
import parse from 'node-html-parser';
import { z } from 'zod';

import { db } from '$lib/db';
import { getImageFromHtml } from '$lib/jobs/refresher';
import { jsonFeedSchema } from '$lib/types/schemas/feeds';
import { getHostname } from '$lib/utils';
import { stripEmptyTags } from '$lib/utils/sanitize';

import {
	getLink,
	getText,
	isAudioType,
	isJson,
	isXml,
	linkSelectors,
	normalizeUrl,
	resolveUrl,
} from './utils';
import { assertsJsonFeed } from '$lib/helpers/feeds';
import type { FeedType } from '$lib/db/queries/subscriptions';

export type Feed = {
	favicon?: string;
	feeds: Array<{
		title: string;
		url: string;
	}>;
	input: string;
};
const parser = new XMLParser({
	attributeNamePrefix: '',
	ignoreAttributes: false,
});

/**
 *
 * @param feedUrl the url to try to find feeds for
 * @param _fetch Sveltekit-scoped fetch
 * @returns An array of feeds
 */
export async function findFeed(feedUrl: string): Promise<{
	favicon?: string;
	feeds: Array<{
		title: string;
		url: string;
		type?: FeedType;
	}>;
	input: string;
}> {
	try {
		// First, normalize URL.
		const url = new URL(normalizeUrl(feedUrl));
		console.log({ feedUrl, url: url.toString() });
		const response = await fetch(url, {
			method: 'GET',
			// TODO: headers saying we come in peace
		});
		console.log({ response });
		if (!response.ok) {
			console.error('Could not find feed.');
			return {
				feeds: [],
				input: feedUrl,
			};
		}
		const body = await response.text();
		const contentType = response.headers.get('content-type');
        console.log({ body, contentType });
				if (
					(contentType && isXml(contentType)) ||
					body.trim().startsWith('<?xml')
				) {
					// We're in XML land
					console.log('xml');
					const parsed = parser.parse(body);
					const data = parsed.rss?.channel || parsed.feed;
					const title = getText(data?.title);
					const image = data?.image?.url || data?.icon;
					return {
						favicon:
							image ||
							`https://icon.horse/icon/${getHostname(
								data.link || data.url || feedUrl,
							)}`,
						feeds: [
							{
								title,
								url: feedUrl,
							},
						],
						input: feedUrl,
					};
				} else if (contentType && isJson(contentType)) {
					try {
						console.log({ body });
						const parsed = JSON.parse(body);
						assertsJsonFeed(parsed);
						const { icon, title } = parsed;
						const location = response.headers.get('location');
						return {
							favicon: icon || `https://icon.horse/icon/?uri=${feedUrl}`,
							feeds: [
								{
									title,
									// We use url instead of parsed.feed_url, because sometimes people don't update their feed_url...
									// In practice, if we got the data from this url, it means it's the right url
									// We use response.url since we want to use the final url (after redirects)
									url: response.url,
									type: 'json',
								},
							],
							input: feedUrl,
						};
					} catch {
						console.error('failed parsing JSON Feed');
						return {
							feeds: [],
							input: feedUrl,
						};
					}
				} else {
					// The URL was not XML or JSON — so let's try to find the feed now
					console.log('html - try parsing to find feed');
					const root = parse(body);
					console.log('got root', root);
					const links = root
						.querySelectorAll(linkSelectors)
						.map((l) => l.attributes.href)
						.filter(Boolean);
					if (!links.length) {
						// try /feed as a last ditch effort
						if (!feedUrl.endsWith('/feed')) {
							// const newUrlToTry = new URL('/feed', feedUrl);
							// return findFeed(newUrlToTry.href);
						} else {
							return {
								feeds: [],
								input: feedUrl,
							};
						}
					}
					// for (const link of links) {
					// 	const resolved = resolveUrl(url.toString(), link);
					// 	console.log(`trying to fetch ${resolved}`);
					// 	console.log(await findFeed(resolveUrl(url.toString(), link)));
					// }
					console.log(`Found ${links.length} links to check!`);
					console.time('feedCrawl');
					const allFeeds = await Promise.all(
						links.map(async (link) => {
							return findFeed(resolveUrl(feedUrl, link));
						}),
					);
					console.timeEnd('feedCrawl');
					console.log({ allFeeds });
					const favicon = allFeeds.find((f) => {
						if (!f.favicon) {
							return false;
						}
						if (f.favicon.startsWith('https://icon.horse')) {
							return false;
						}
						return true;
					})?.favicon;
					return {
						favicon,
						feeds: allFeeds.flatMap((f) => f.feeds),
						input: feedUrl,
					};
				}
	} catch (error) {
		console.error(error);
		return {
			feeds: [],
			input: feedUrl,
		};
	}
}

// todo: put this somewhere else
const feedsToAdd = z.object({
	feeds: z.array(z.object({ title: z.string(), url: z.string().url() })),
});

function parseXml(xml: string) {
	const parsedXml = parser.parse(xml);
	return parsedXml;
}

function getTextContent(html: string) {
	const root = parse(html);
	const textContent = root.textContent;
	return textContent;
}

const createFeedAndEntries = ({
	entries,
	feedUrl,
	lastBuildDate,
	link,
	podcast,
	title,
}: {
	creator?: string;
	description?: string;
	entries: Prisma.Enumerable<Prisma.EntryCreateManyFeedInput>;
	feedUrl: string;
	imageUrl?: string;
	lastBuildDate?: string;
	link?: string;
	podcast?: boolean;
	title: string;
}) => {
	// i think it's preferred to filter out entries first, but otherwise we can still use skipduplicates
	return {
		entries: {
			createMany: {
				data: entries,
				skipDuplicates: true,
			},
		},
		feedUrl,
		lastBuildDate,
		link,
		podcast,
		title,
	};
};
function hmsToSecondsOnly(str: string) {
	const p = str.split(':');
	let s = 0,
		m = 1;

	while (p.length > 0) {
		s += m * Number.parseInt(p.pop(), 10);
		m *= 60;
	}

	return s;
}

const getDuration = (duration: string | number | undefined) => {
	if (typeof duration === 'number') {
		return duration;
	}
	if (typeof duration === 'string') {
		return hmsToSecondsOnly(duration);
	}
	return undefined;
};

export function parseEntry(
	entry: any,
	podcast: boolean,
	feedId?: number,
	feedImage?: string,
) {
	console.log(`processing entry`, entry.title);
	let guid: string | undefined = undefined;
	if (entry.guid) {
		guid = getText(entry.guid);
	} else if (entry.id) {
		guid = getText(entry.id);
	}
	console.log(`guid`, guid);
	const published =
		entry.published || entry.pubDate || entry.pubdate || entry.updated;
	const description = getText(entry.summary, entry.description);
	const html = getText(entry.content, entry['content:encoded']) || description;
	const link = getLink(entry.link);
	console.log(`link`, link);
	let enclosureUrl: string | undefined = undefined;
	if (entry.enclosure) {
		if (isAudioType(entry.enclosure.type)) {
			enclosureUrl = entry.enclosure.url;
		}
	}
	const duration = getDuration(entry['itunes:duration']);
	console.log('duration', duration);
	// convert to seconds
	// if (duration) {
	//     const [hours, minutes, seconds] = duration.split(':').map(Number)
	//     duration = (hours * 60 * 60 + minutes * 60 + seconds)
	// }
	const finalEntry = {
		author: getText(entry.author?.name || entry['itunes:author'] || ''),
		enclosureUrl,
		duration,
		guid: guid?.toString(),
		feedId,
		html,
		image:
			getLink(entry['itunes:image']) ||
			feedImage ||
			getImageFromHtml(entry.content, link),
		published: dayjs(published).isValid()
			? dayjs(published).format()
			: undefined,
		summary: html === description ? undefined : description,
		title: getText(entry.title),
		type: podcast && !!enclosureUrl ? DocumentType.audio : DocumentType.article,
		updated: entry.updated,
		uri: link || enclosureUrl,
		// TODO: episode no., ordering
	};
	// const finalEntry = createEntry(feed.id, {
	// 	title: getText(entry.title),
	// 	type: podcast ? DocumentType.audio : DocumentType.article,
	// 	uri: link || enclosureUrl,
	// 	image: getImageFromHtml(entry.content, link),
	// 	guid,
	// 	html,
	// 	published: dayjs(published).isValid() ? dayjs(published).format() : undefined,
	// 	updated: entry.updated,
	//     enclosureUrl,
	//     duration,
	// 	author: getText(entry.author?.name),
	// 	summary: html === description ? undefined : description,
	// });
	console.log('final entry');
	return finalEntry;
}

export const addSubscription = async ({
	feedUrl,
	title,
	userId,
}: {
	feedUrl: string;
	title: string;
	userId: string;
}) => {
	// todo: somehow have this cached so i don't have to re-fetch on search/add
	const response = await fetch(feedUrl);
	const body = await response.text();
	// data should be xml
	const contentType = response.headers.get('content-type');
	let data: ReturnType<typeof createFeedAndEntries> | undefined = undefined;
	if ((contentType && isXml(contentType)) || body.trim().startsWith('<?xml')) {
		const parsed = parseXml(body);
		const podcast =
			parsed.rss?.['xmlns:itunes'] ===
			'http://www.itunes.com/dtds/podcast-1.0.dtd';
		const feed = parsed.rss?.channel || parsed.feed;
		console.dir(feed, { depth: null });
		const description = getText(feed.description, feed.subtitle);
		let entries = feed.items || feed.item || feed.entry || [];
		if (!Array.isArray(entries)) {
			entries = [entries];
		}
		const imageUrl = feed.image?.url || getLink(feed['itunes:image']) || '';
		// todo: get podcast data from podcastindexid if it exists
		data = createFeedAndEntries({
			description: description ? stripEmptyTags(description) : '',
			// TODO: types
			entries: entries.slice(0, 20).map((entry: any) => {
				return parseEntry(entry, podcast, undefined, imageUrl);
			}),

			feedUrl: feed.feed_url || feedUrl,

			imageUrl,

			podcast,

			title: getText(feed.title) || '',
		});
	} else if (contentType && isJson(contentType)) {
		const { feed_url, items, title } = jsonFeedSchema.parse(JSON.parse(body));
		console.log(`[json feed] ${feed_url}`);
		data = createFeedAndEntries({
			entries: items.map((item) => {
				return {
					author: item.authors?.join(', '),
					html: item.content_html,
					published: item.date_published,
					text: item.content_text,
					title: item.title,
					type: DocumentType.article,
					updated: item.date_modified,
					uri: item.url,
				};
			}),
			feedUrl,
			title,
		});
	}
	if (!data) {
		// throw Error('Could not find feed');
		console.error('Could not find feed');
		return;
	} else if (data) {
		const feed = await db.feed.upsert({
			create: data,
			update: data,
			where: {
				feedUrl: data.feedUrl,
			},
		});
		// now create subscription
		return db.subscription.create({
			data: {
				feedId: feed.id,
				title,
				userId,
			},
		});
	}
};
