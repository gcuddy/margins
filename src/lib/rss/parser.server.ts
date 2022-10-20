import { stripEmptyTags, stripTags } from '$lib/utils/sanitize';
import type { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import getUuidByString from 'uuid-by-string';
dayjs.extend(localizedFormat);
import { parse } from 'node-html-parser';
import { XMLParser } from 'fast-xml-parser';
import { isJson, isXml, linkSelectors, resolveUrl } from './utils';
import { db } from '$lib/db';

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '',
});
/**
 * parse xml
 * @param {string} xml
 */
function parseXml(xml) {
	const parsedXml = parser.parse(xml);
	const data = parsedXml.rss?.channel || parsedXml.feed;
	return data;
}
/**
 *
 *
 *
 * @param url the url of the site to find the feed for
 * @returns XML String of the feed
 */
export async function findFeed(url: string) {
	const _url = new URL(url);
	// console.log({ _url });
	const response = await fetch(_url);
	const body = await response.text();
	const contentType = response.headers.get('content-type');
	if ((contentType && isXml(contentType)) || body.trim().startsWith('<?xml')) {
		return parseXml(body);
	} else if (isJson(contentType)) {
		return JSON.parse(body);
	} else {
		const root = parse(body);
		const links = root.querySelectorAll(linkSelectors);
		let href = '';
		// const href = link?.attributes.href;
		while (!href && links.length) {
			const link = links.shift();
			// (todo: support json)
			if (link) {
				href = link.attributes.href;
			}
		}
		if (!href) {
			console.error('Could not find rss feed for url', url);
			return;
		}
		href = resolveUrl(url, href);
		return findFeed(href);
	}
}

export async function buildRssFeed(data: any, url: string, existingUuids?: string[]) {
	const description = getText(data.description, data.subtitle);
	console.log(`attempting to build rss feed for ${url}`);
	return {
		title: data.title as string,
		link: data.home_page_url || (getLink(data.link, 'alternate', undefined) as string),
		description: description ? await stripEmptyTags(description) : '',
		imageUrl: (data.image?.url as string) || '',
		feedUrl: data.feed_url || url,
		items: await Promise.all(
			(data.items || data.item || data.entry)
				.slice(0, 400)
				.map(async (item) => buildFeedItem(item, url)) as Prisma.RssFeedItemUncheckedCreateInput[]
		),
	};
}

const getText = (...items: any) => {
	for (const item of items) {
		if (typeof item === 'string') {
			return item;
		}
		if (item?.['#text']) {
			return item['#text'] as string;
		}
		if (Array.isArray(item)) {
			return item.map((i) => getText(i)).join(', ') as string;
		}
	}
	return '';
};

const getLink = (link: any, ...rel: (string | undefined)[]) => {
	if (typeof link === 'string') {
		return link;
	}
	if (link?.href) {
		return link.href;
	}
	if (Array.isArray(link)) {
		if (rel.length) {
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
	return '';
};
export async function buildFeedItem(
	item: any,
	feedUrl: string
): Promise<Prisma.RssFeedItemCreateWithoutFeedInput> {
	const { title } = item;
	const image =
		item.enclosure?.type === 'image/jpeg'
			? item.enclosure.url
			: item['media:content']?.url || item['itunes:image']?.href || item['media:thumbnail']?.url;
	const description = await stripEmptyTags(
		getText(
			item.description,
			item.content,
			item.content_html,
			item['content:encoded'],
			item.summary,
			item['itunes:summary']
		)
	);
	const guid = getText(item.guid, item.id) || undefined;
	const link = getLink(item.url) || getLink(item.link);
	return {
		title: getText(title) as string,
		// enclosure: item.enclosure,
		pubDate: dayjs(item.date_published || item.pubDate || item.published || item.updated).format(),
		content: item.content_html || item.content?.['#text'] || item['content:encoded'] || description,
		contentSnippet: (await stripTags(description))?.slice(0, 200),
		link,
		image,
		// getContent(element, ["creator", "dc:creator", "author", "author.name"]
		author: getText(item['dc:creator'], item.creator, item.author, item.author?.name),
		uuid: buildId({ guid, link, feedUrl }),
	};
}

export async function buildPodcast(url: string) {
	const xml = parser.parse(await fetch(url).then((res) => res.text()));
	if (xml.rss?.['xmlns:itunes'] !== 'http://www.itunes.com/dtds/podcast-1.0.dtd') {
		throw new Error('malformed podcast feed');
	}
	return {
		title: xml.rss.channel.title,
		description: await stripEmptyTags(xml.rss.channel.description),
		imageUrl: xml.rss.channel.image?.url,
		creator: xml.rss.channel['itunes:author'],
		feedUrl: url,
		items: await Promise.all(xml.rss.channel.item.map(async (item) => buildItem(item, url))),
	};
}
function convertToSeconds(duration) {
	console.log({ duration });
	if (typeof duration === 'number') {
		return duration;
	}
	if (!duration?.includes(':')) {
		return Number(duration);
	}
	const [minutes, seconds] = duration.split(':');
	return Number(minutes) * 60 * 60 + Number(seconds) * 60;
}

export function buildId({
	guid,
	enclosure,
	link,
	feedUrl,
}: {
	feedUrl: string;
	guid?: string;
	enclosure?: {
		url: string;
	};
	link?: string;
}) {
	const parts: string[] = [];
	parts.push(feedUrl);
	parts.push(guid || '');
	parts.push(enclosure?.url || link || '');
	return getUuidByString(parts.join(''));
}

export async function buildItem(item: any, feedUrl: string) {
	const date = dayjs(item.pubDate).format('ll');
	const link = item.link;
	return {
		title: item.title,
		enclosure: item.enclosure,
		link,
		pubDate: dayjs(item.pubDate).format(),
		guid: item.guid?.['#text'],
		image: item['itunes:image']?.['_@href'],
		description: await stripTags(item.description),
		duration: convertToSeconds(item['itunes:duration']),
		podcast: true,
		uuid: buildId({ guid: item.guid?.['#text'], enclosure: item.enclosure, link, feedUrl }),
	};
}

export async function getRefreshedItems(userId?: string) {
	const feeds = await db.rssFeed.findMany({
		where: {
			users: userId
				? {
						some: {
							id: userId,
						},
				  }
				: undefined,
			podcast: false,
		},
		include: {
			items: true,
		},
	});
	const updatedFeeds = await Promise.all(
		feeds.map(async (f) => {
			const data = await findFeed(f.feedUrl);
			return buildRssFeed(data, f.feedUrl);
		})
	);
	const transactions = feeds.map((feed, index) => {
		return db.rssFeed.update({
			where: {
				id: feed.id,
			},
			data: {
				items: {
					createMany: {
						skipDuplicates: true,
						data: updatedFeeds[index].items,
					},
				},
			},
			include: {
				items: true,
			},
		});
	});
	const newFeeds = await db.$transaction(transactions);
	// return newFeedItems that are diff from updatedFeeds
	const newItems = newFeeds.flatMap((feed) => feed.items);
	const oldItems = feeds.flatMap((feed) => feed.items);
	const newFeedItems = newItems.filter((item) => !oldItems.some((i) => i.uuid === item.uuid));
	return newFeedItems;
}
