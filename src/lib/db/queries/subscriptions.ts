// websocket version would be cool

import { z } from 'zod';

import pindex from '$lib/api/pindex';
import { db, values } from '$lib/db';

import type JSONFeed from '@json-feed-types/1_1';
import type { GetCtx } from '../types';
import type { Insertable } from 'kysely';
import type { Entry, Feed } from '$lib/prisma/kysely/types';
import { XMLParser } from 'fast-xml-parser';
import {
	type FeedAddFormSchema,
	feedAddFormSchema,
} from '$components/subscriptions/subscription-entry.schema';
import { isJsonFeed } from '$lib/helpers/feeds';
import { stripTags } from '$lib/utils/sanitize';
import { generatePublicId } from '$lib/nanoid';
import { query } from '$lib/server/utils';
export const youtubeRegex =
	/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)(?<id>[^"&?/\s]{11})/;
const xmlParser = new XMLParser({
	attributeNamePrefix: '',
	ignoreAttributes: false,
});

export const subscriptionInputSchema = z.object({
	/** Feed Id */
	feedId: z.number(),
});

export type FeedType = 'json' | 'rss' | 'atom';

function parseMediaGroup(mediaGroup: any) {
	// https://www.rssboard.org/media-rss#media-group
	if (!mediaGroup) {
		return {};
	}
	const mediaContent = mediaGroup['media:content'];
	const url = mediaContent.url;

	let youtubeId: string | null = null;
	if (typeof url === 'string' && url.includes('youtube.com')) {
		const match = url.match(youtubeRegex);
		youtubeId = match?.groups?.id ?? null;
	}

	const mediaTitle = mediaGroup['media:title'];
	const text = mediaGroup['media:description'];
	const mediaThumbnail = mediaGroup['media:thumbnail'];

	const image = mediaThumbnail?.url;

	const type =
		youtubeId || mediaContent?.type?.includes('video')
			? 'video'
			: mediaContent?.type?.includes('audio')
			? 'audio'
			: undefined;
	return {
		enclosureUrl: url,
		image,
		text,
		title: mediaTitle,
		type: type as 'audio' | 'video' | undefined,
		youtubeId,
	} satisfies Partial<Insertable<Entry>>;
}

async function getFeedData(res: Response): Promise<
	| {
			data: any;
			type: 'rss' | 'atom';
	  }
	| {
			data: JSONFeed;
			type: 'json';
	  }
> {
	const contentType = res.headers.get('content-type');
	if (contentType?.includes('application/json')) {
		const json = await res.json();
		if (isJsonFeed(json)) {
			return {
				data: json,
				type: 'json',
			};
		}
	}
	// then it's xml
	const text = await res.text();
	const parsed = xmlParser.parse(text);

	if ('feed' in parsed) {
		return {
			data: parsed.feed,
			type: 'atom',
		};
	} else if ('rss' in parsed) {
		return {
			data: parsed.rss,
			type: 'rss',
		};
	} else {
		// try parsing raw as json and see if it has jsonfeed in it, possible that it's a jsonfeed with a different content-type
		const json = JSON.parse(text);
		if (isJsonFeed(json)) {
			return {
				data: json,
				type: 'json',
			};
		}
		// If we're here, we don't know what the feed is
		throw new Error('Unknown feed type');
	}
}

function parseJsonFeedItems(
	json: JSONFeed,
	feedId: number,
	since?: Date,
): Array<Insertable<Entry>> {
	const items = json.items.filter((item) => {
		if (!since) {
			return true;
		}
		const lastUpdated = item.date_modified || (item as any).date_updated;
		if (!lastUpdated) {
			return true;
		}
		const lastUpdateDate = new Date(lastUpdated);
		return lastUpdateDate > since;
	});
	return items.map((item: any) => {
		return {
			author: item.authors?.map((a: any) => a.name).join(', '),
			feedId,
			guid: item.id,
			html: item.content_html,
			public_id: generatePublicId(),
			published: new Date(item.date_published),
			text: item.content_text || stripTags(item.content_html),
			title: item.title,
			updatedAt: new Date(),
			uri: item.url,
		} satisfies Insertable<Entry>;
	});
}

function getAtomLink(links: any, rel = 'alternate') {
	if (!links) {
		return null;
	}
	if (Array.isArray(links)) {
		return (links as Array<any>).find((link: any) => link.rel === rel)
			?.href as string;
	} else if (typeof links === 'object') {
		return links.href as string;
	}
}
function parseAtomFeedItems(
	feed: any,
	feedId: number,
	since?: Date,
): Array<Insertable<Entry>> {
	if (since && feed.updated) {
		const updated = new Date(feed.updated);
		if (since > updated) {
			return [];
		}
	}

	const alternateLink = getAtomLink(feed.link);
	const relatedLink = getAtomLink(feed.link, 'related');

	const entries = feed.entry.filter((entry: any) => {
		if (!since) {
			return true;
		}
		const updated = entry.updated || entry.published;
		if (!updated) {
			return true;
		}
		const updatedDate = new Date(updated);
		return updatedDate > since;
	});
	return entries.map((entry: any) => {
		const content = getText(entry.content);
		const published = entry.published || entry.updated;

		const alternateLink = getAtomLink(entry.link);
		const relatedLink = getAtomLink(entry.link, 'related');

		return {
			author: entry.author?.name,
			feedId,
			guid: entry.id,
			html:
				alternateLink && relatedLink
					? `<i>Link: <a href='${alternateLink}'>${alternateLink}</a>
            ${content}`
					: content,
			public_id: generatePublicId(),
			published: published ? new Date(published) : null,
			summary: stripTags(getText(entry.summary)).slice(0, 255),
			text: stripTags(content),
			title: getText(entry.title),
			updatedAt: new Date(),
			uri:
				(alternateLink && relatedLink ? relatedLink : alternateLink) ||
				entry.id,
			youtubeId: entry['yt:videoId'],
			...parseMediaGroup(entry['media:group']),
		} satisfies Insertable<Entry>;
	});
}

function getText(...nodes: Array<unknown>): string {
	for (const node of nodes) {
		if (typeof node === 'string') {
			return node;
		}
		if (typeof node === 'object' && node && '#text' in node) {
			return getText(node['#text']);
		}
	}
	return '';
}

// TODO
type RssFeed = {
	channel: {
		description: string;
		image: {
			url: string;
		};
		item: Array<{
			'content:encoded': string;
			description: string;
			enclosure: {
				url: string;
			};
			guid: string;
			image: {
				url: string;
			};
			link: string;
			pubDate: string;
			'itunes:author': string;
			title: string;
		}>;
		lastBuildDate: string;
		link: string;
	};
};

function parseRssFeedItems(
	rss: any,
	feedId: number,
	since?: Date,
): Array<Insertable<Entry>> {
	console.log('parsing rss since', since);
	// check last build date, if it exists. If it's older than since, return empty array
	if (since && rss.channel.lastBuildDate) {
		const lastBuildDate = new Date(rss.channel.lastBuildDate);
		if (since > lastBuildDate) {
			console.log('since is greater than last build date');
			return [];
		}
	}

	// filter out items that are older than since
	const items = rss.channel.item.filter((item: any) => {
		if (!since) {
			return true;
		}
		if (!item.pubDate) {
			return true;
		}
		const pubDate = new Date(item.pubDate);
		return pubDate > since;
	});

	console.log('new items to map over:', items.length);

	return items.map((item: any) => {
		const html = item['content:encoded'] || item.description;
		return {
			author: getText(item['dc:creator'], item.author, item['itunes:author']),
			duration: null,
			enclosureLength: null,
			enclosureType: null,
			enclosureUrl: item.enclosure?.url,
			feedId,
			guid: getText(item.guid),
			html,
			image: item.image?.url,
			podcastIndexId: null,
			public_id: generatePublicId(),
			published: item.pubDate
				? new Date(item.pubDate)
				: item.isoDate
				? new Date(item.isoDate)
				: null,
			summary: item.description
				? stripTags(item.description?.slice(0, 255))
				: null,
			text: item.description ? stripTags(html) : null,
			title: item.title,
			type: 'article',
			updatedAt: new Date(),
			uri: item.link || item.enclosure?.url,
			youtubeId: item['yt:videoId'],
			...parseMediaGroup(item['media:group']),
		} as Insertable<Entry>;
	});
}

function parseRssFeedInfo(rss: any, feedUrl?: string) {
	return {
		description: rss.channel.description,
		feedUrl: feedUrl ?? rss.channel.link,
		guid: rss.channel.link,
		imageUrl: rss.channel.image?.url,
		title: rss.channel.title,
		updatedAt: new Date(),
	} satisfies Insertable<Feed>;
}

function parseAtomFeedInfo(feed: any, feedUrl: string) {
	return {
		feedUrl,
		imageUrl: feed.logo || feed.icon,
		title: getText(feed.title),
		updatedAt: new Date(),
	} satisfies Insertable<Feed>;
}

function parseJsonFeedInfo(json: JSONFeed, feedUrl: string) {
	return {
		feedUrl,
		imageUrl: json.icon || json.favicon,
		title: json.title,
		updatedAt: new Date(),
	} satisfies Insertable<Feed>;
}

export async function getFeedInfo(data: any, type: FeedType, feedUrl: string) {
	if (type === 'json') {
		return parseJsonFeedInfo(data, feedUrl);
	} else if (type === 'atom') {
		return parseAtomFeedInfo(data, feedUrl);
	} else {
		return parseRssFeedInfo(data, feedUrl);
	}
}

export async function getLatestFeedItems(
	// TODO: better type here
	data: any,
	type: FeedType,
	feedId: number,
	since?: Date,
): Promise<Array<Insertable<Entry>>> {
	if (type === 'json') {
		return parseJsonFeedItems(data, feedId, since);
	} else if (type === 'atom') {
		return parseAtomFeedItems(data, feedId, since);
	} else {
		return parseRssFeedItems(data, feedId, since);
	}
}

async function updateLatestFeedItems(
	...args: Parameters<typeof getLatestFeedItems>
) {
	const items = await getLatestFeedItems(...args);
	const feedId = args[2];
	await db.transaction().execute(async (trx) => {
		await trx
			.insertInto('Entry')
			.values(items)
			// TODO: Review if this should happen or not...
			// What if the entry url already exists, independent of the feed? We probably shouldn't update the HTML in that case...
			// Same with author, etc. *Unless* the feed content is better...?
			.onDuplicateKeyUpdate(({ ref }) => ({
				// author: values(ref('author')),
				duration: values(ref('duration')),
				enclosureUrl: values(ref('enclosureUrl')),
				feedId,
				guid: values(ref('guid')),
				// html: values(ref('html')),
				image: values(ref('image')),
				podcastIndexId: values(ref('podcastIndexId')),
				// published: values(ref('published')),
				// summary: values(ref('summary')),
				// text: values(ref('text')),
				// title: values(ref('title')),
				// type: values(ref('type')),
				updatedAt: new Date(),
				// uri: values(ref('uri')),
			}))
			.execute();

		return await trx
			.updateTable('Feed')
			.set({ lastParsed: new Date() })
			.where('id', '=', feedId)
			.execute();
	});
}

// get subscription. If it hasn't been updated in last 10 minutes, schedules check for new episodes.
// Also see Cron Job, which checks all subscriptions every 30 minutes.
export async function subscription({
	ctx,
	input,
}: GetCtx<typeof subscriptionInputSchema>) {
	// eslint-disable-next-line no-console
	console.time('subscription');
	const feed = await db
		.selectFrom('Feed as f')
		.where('f.id', '=', input.feedId)
		.innerJoin('Subscription as s', (join) =>
			join.onRef('f.id', '=', 's.feedId').on('s.userId', '=', ctx.userId),
		)
		.select([
			'f.id',
			'f.id as feedId',
			's.title',
			's.id as subscriptionId',
			'f.lastParsed',
			'f.podcastIndexId',
			// 'f.podcast',
			's.updatedAt',
			'f.feedUrl',
			'f.imageUrl',
			'f.link',
			'f.guid',
			// 'f.lastParsed',
			// 'f.podcast',
			// 'f.podcastIndexId',
			// 'f.guid'
		])
		.executeTakeFirstOrThrow();

	const needsRefetching =
		!feed.lastParsed ||
		(feed.lastParsed &&
			feed.lastParsed < new Date(Date.now() - 10 * 60 * 1000));
	// console.log({ needsRefetching });
	// if it's a podcast, use podcastindex to check
	// TODO: this should get moved to qstash messaging and use redis
	// TODO: Stream this!
	if (needsRefetching && feed.podcastIndexId) {
		// await updatePodcastFeed(feed);
	} else if (needsRefetching && feed.feedUrl) {
		// get feed items
		// await updateFeed(feed);
		// const res = await fetch(feed.feedUrl);
		// const { data, type } = await getFeedData(res);
		// const items = await getLatestFeedItems(
		// 	data,
		// 	type,
		// 	feed.id,
		// 	feed.lastParsed ? new Date(feed.lastParsed) : undefined,
		// );
		// console.log({ items });
		// if (items.length) {
		// 	await db.transaction().execute(async (trx) => {
		// 		await trx
		// 			.insertInto('Entry')
		// 			.values(items)
		// 			// .ignore()
		// 			// hm
		// 			.onDuplicateKeyUpdate(({ ref }) => ({
		// 				author: values(ref('author')),
		// 				duration: values(ref('duration')),
		// 				enclosureUrl: values(ref('enclosureUrl')),
		// 				feedId: feed.id,
		// 				guid: values(ref('guid')),
		// 				html: values(ref('html')),
		// 				image: values(ref('image')),
		// 				podcastIndexId: values(ref('podcastIndexId')),
		// 				published: values(ref('published')),
		// 				summary: values(ref('summary')),
		// 				text: values(ref('text')),
		// 				title: values(ref('title')),
		// 				type: values(ref('type')),
		// 				updatedAt: new Date(),
		// 				uri: values(ref('uri')),
		// 			}))
		// 			.execute();
		// 		return await trx
		// 			.updateTable('Feed')
		// 			.set({ lastParsed: new Date() })
		// 			.where('id', '=', feed.id)
		// 			.execute();
		// 	});
		// }
	}

	// TODO: use get_library but make get_library get_entries
	// const entries = await db
	// 	.selectFrom('Entry as e')
	// 	.where('feedId', '=', input.feedId)
	// 	.select(entrySelect)
	// 	.select('e.updatedAt')
	// 	.select('e.guid')
	// 	.orderBy('published', 'desc')
	// 	.execute();

	// const { entries, nextCursor } = await get_library({
	// 	dir: 'desc',
	// 	filter: {
	// 		feed: {
	// 			eq: input.feedId,
	// 		},
	// 	},
	// 	library: false,
	// 	sort: 'published',
	// 	status: null,
	// 	userId: ctx.userId,
	// });
	// eslint-disable-next-line no-console
	console.timeEnd('subscription');
	return {
		// entries,
		feed,
		// nextCursor,
	};

	// TODO: schedule a job to parse this feed
}

export async function subscriptionCreate({
	ctx,
	input,
}: GetCtx<FeedAddFormSchema>) {
	// get feed info
	console.log('[subscriptionCreate] input', input);
	const feedIds: number[] = [];
	for (const feed of input) {
		// for now, use podcastindex to get feed info
		// TODO: get this info ourselves
		if (feed.podcastIndexId) {
			const { feed: pfeed } = await pindex.podcastById(feed.podcastIndexId);
			await db
				.insertInto('Feed')
				.values({
					updatedAt: new Date(),
					feedUrl: pfeed.url,
					title: pfeed.title,
					podcast: 1,
					podcastIndexId: pfeed.id,
					creator: pfeed.author,
					imageUrl: pfeed.artwork,
					description: pfeed.description,
					itunesId: pfeed.itunesId,
					link: pfeed.link,
				})
				.ignore()
				.execute();
			const _feed = await db
				.selectFrom('Feed')
				.where('podcastIndexId', '=', feed.podcastIndexId)
				.select('id')
				.executeTakeFirstOrThrow();
			await db
				.insertInto('Subscription')
				.values({
					feedId: _feed.id,
					title: feed.title,
					updatedAt: new Date(),
					userId: ctx.userId,
				})
				.onDuplicateKeyUpdate({
					title: feed.title,
					updatedAt: new Date(),
				})
				.execute();
			await updatePodcastFeed({
				id: _feed.id,
				podcastIndexId: feed.podcastIndexId,
				lastParsed: null,
			});
			feedIds.push(_feed.id);
			continue;
		} else {
			const res = await fetch(feed.url);
			const { data, type } = await getFeedData(res);
			const feedInfo = await getFeedInfo(data, type, feed.url);
			await db.insertInto('Feed').values(feedInfo).ignore().execute();
			const _feed = await db
				.selectFrom('Feed')
				.where('feedUrl', '=', feedInfo.feedUrl)
				.select('id')
				.executeTakeFirstOrThrow();

			await db
				.insertInto('Subscription')
				.values({
					feedId: _feed.id,
					title: feed.title,
					updatedAt: new Date(),
					userId: ctx.userId,
				})
				.onDuplicateKeyUpdate({
					title: feed.title,
					updatedAt: new Date(),
				})
				.execute();
			await updateLatestFeedItems(data, type, _feed.id);
			feedIds.push(_feed.id);
		}
	}
	return {
		ids: feedIds,
	};
}

export const subscriptionCreateMutation = query({
	fn: subscriptionCreate,
	schema: feedAddFormSchema,
});

export async function updateFeed(feed: {
	id: number;
	feedUrl: string | null;
	lastParsed: Date | null;
}) {
	if (!feed.feedUrl) {
		return;
	}
	const res = await fetch(feed.feedUrl);
	const { data, type } = await getFeedData(res);
	const items = await getLatestFeedItems(
		data,
		type,
		feed.id,
		feed.lastParsed ? new Date(feed.lastParsed) : undefined,
	);
	console.log(
		`Found ${items.length} new items for feed ${feed.id} - ${feed.feedUrl}`,
	);
	await db.transaction().execute(async (trx) => {
		if (items.length) {
			await trx
				.insertInto('Entry')
				.values(items)
				// .ignore()
				// hm
				.onDuplicateKeyUpdate(({ ref }) => ({
					author: values(ref('author')),
					duration: values(ref('duration')),
					enclosureUrl: values(ref('enclosureUrl')),
					feedId: feed.id,
					guid: values(ref('guid')),
					html: values(ref('html')),
					image: values(ref('image')),
					podcastIndexId: values(ref('podcastIndexId')),
					published: values(ref('published')),
					summary: values(ref('summary')),
					text: values(ref('text')),
					title: values(ref('title')),
					type: values(ref('type')),
					updatedAt: new Date(),
					uri: values(ref('uri')),
				}))
				.execute();
		}

		return await trx
			.updateTable('Feed')
			.set({ lastParsed: new Date() })
			.where('id', '=', feed.id)
			.execute();
	});
}

export async function updatePodcastFeed(feed: {
	id: number;
	podcastIndexId: number | null;
	lastParsed: Date | null;
}) {
	const insertable = await getPodcastFeedInsertable(feed);
	await db.transaction().execute(async (trx) => {
		if (insertable.length) {
			await trx
				.insertInto('Entry')
				.values(insertable)
				// TODO: Review this - do we actually *not* want it to update on conflict, as to not overwrite things?
				.onDuplicateKeyUpdate(({ ref }) => ({
					duration: values(ref('duration')),
					enclosureLength: values(ref('enclosureLength')),
					enclosureType: values(ref('enclosureType')),
					enclosureUrl: values(ref('enclosureUrl')),
					feedId: values(ref('feedId')),
					guid: values(ref('guid')),
					image: values(ref('image')),
					podcastIndexId: values(ref('podcastIndexId')),
					published: values(ref('published')),
					summary: values(ref('summary')),
					text: values(ref('text')),
					title: values(ref('title')),
					type: 'podcast',
					updatedAt: new Date(),
					uri: values(ref('uri')),
				}))
				.execute();
		}
		return await trx
			.updateTable('Feed')
			.set({ lastParsed: new Date() })
			.where('id', '=', feed.id)
			.execute();
	});
}

// TODO Should we also return an updatable? I.e. in an object of { insertable, updatable }?
export async function getPodcastFeedInsertable(feed: {
	id: number;
	podcastIndexId: number | null;
	lastParsed: Date | null;
}): Promise<Array<Insertable<Entry>>> {
	console.log(
		`Needs refetching: Fetching ${feed.podcastIndexId} from podcastindex`,
	);
	if (!feed.podcastIndexId) {
		return [];
	}
	let episodes = await pindex
		.episodesByFeedId(feed.podcastIndexId)
		.then((p) => p.items);

	// filter episodes
	episodes = episodes.filter((episode) => {
		if (!feed.lastParsed) {
			return true;
		}
		return new Date(episode.datePublished * 1000) > feed.lastParsed;
	});

	return episodes.map((episode) => ({
		duration: episode.duration,
		enclosureLength: episode.enclosureLength,
		enclosureType: episode.enclosureType,
		enclosureUrl: episode.enclosureUrl,
		feedId: feed.id,
		// guid: feed.guid,
		image: episode.image || episode.feedImage,
		podcastIndexId: episode.id,
		public_id: generatePublicId(),
		published: new Date(episode.datePublished * 1000),
		summary: stripTags(episode.description.slice(0, 200)),
		text: episode.description,
		title: episode.title,
		type: 'podcast',
		updatedAt: new Date(),
		uri: episode.enclosureUrl,
	}));

	// console.log(`Found ${episodes.length} new episodes for feed ${feed.id}`);

	// await db.transaction().execute(async (trx) => {
	// 	if (episodes.length) {
	// 		await trx
	// 			.insertInto('Entry')
	// 			.values(
	// 				episodes.map((episode) => ({
	// 					duration: episode.duration,
	// 					enclosureLength: episode.enclosureLength,
	// 					enclosureType: episode.enclosureType,
	// 					enclosureUrl: episode.enclosureUrl,
	// 					feedId: feed.id,
	// 					// guid: feed.guid,
	// 					image: episode.image || episode.feedImage,
	// 					podcastIndexId: episode.id,
	// 					published: new Date(episode.datePublished * 1000),
	// 					summary: stripTags(episode.description.slice(0, 200)),
	// 					text: episode.description,
	// 					title: episode.title,
	// 					type: 'podcast',
	// 					updatedAt: new Date(),
	// 					uri: episode.enclosureUrl,
	// 				})),
	// 			)
	// 			// TODO: Review this - do we actually *not* want it to update on conflict, as to not overwrite things?
	// 			.onDuplicateKeyUpdate(({ ref }) => ({
	// 				duration: values(ref('duration')),
	// 				enclosureLength: values(ref('enclosureLength')),
	// 				enclosureType: values(ref('enclosureType')),
	// 				enclosureUrl: values(ref('enclosureUrl')),
	// 				feedId: values(ref('feedId')),
	// 				guid: values(ref('guid')),
	// 				image: values(ref('image')),
	// 				podcastIndexId: values(ref('podcastIndexId')),
	// 				published: values(ref('published')),
	// 				summary: values(ref('summary')),
	// 				text: values(ref('text')),
	// 				title: values(ref('title')),
	// 				type: 'podcast',
	// 				updatedAt: new Date(),
	// 				uri: values(ref('uri')),
	// 			}))
	// 			.execute();
	// 	}
	// 	return await trx
	// 		.updateTable('Feed')
	// 		.set({ lastParsed: new Date() })
	// 		.where('id', '=', feed.id)
	// 		.execute();
	// });
}

export async function getFeedInsertable(feed: {
	id: number;
	feedUrl: string | null;
	lastParsed: Date | null;
}): Promise<Array<Insertable<Entry>>> {
	if (!feed.feedUrl) {
		return [];
	}
	const res = await fetch(feed.feedUrl);
	const { data, type } = await getFeedData(res);
	const items = await getLatestFeedItems(
		data,
		type,
		feed.id,
		feed.lastParsed ? new Date(feed.lastParsed) : undefined,
	);
	console.log(
		`Found ${items.length} new items for feed ${feed.id} - ${feed.feedUrl}`,
	);
	return items;

	// await db.transaction().execute(async (trx) => {
	// 	if (items.length) {
	// 		await trx
	// 			.insertInto('Entry')
	// 			.values(items)
	// 			// .ignore()
	// 			// hm
	// 			.onDuplicateKeyUpdate(({ ref }) => ({
	// 				author: values(ref('author')),
	// 				duration: values(ref('duration')),
	// 				enclosureUrl: values(ref('enclosureUrl')),
	// 				feedId: feed.id,
	// 				guid: values(ref('guid')),
	// 				html: values(ref('html')),
	// 				image: values(ref('image')),
	// 				podcastIndexId: values(ref('podcastIndexId')),
	// 				published: values(ref('published')),
	// 				summary: values(ref('summary')),
	// 				text: values(ref('text')),
	// 				title: values(ref('title')),
	// 				type: values(ref('type')),
	// 				updatedAt: new Date(),
	// 				uri: values(ref('uri')),
	// 			}))
	// 			.execute();
	// 	}

	// 	return await trx
	// 		.updateTable('Feed')
	// 		.set({ lastParsed: new Date() })
	// 		.where('id', '=', feed.id)
	// 		.execute();
	// });
}
