import type { Article, Prisma, PrismaPromise, RssFeed, RssFeedItem } from '@prisma/client';
import Parser from 'rss-parser';
import { db } from '$lib/db';
import dayjs from 'dayjs';
import type { RssFeedWithItems } from '$lib/types/rss';
import uuid from 'uuid-by-string';
import normalizeUrl from 'normalize-url';

// use rehype-parse instead of cheerio?
// do i get cheerio 'for free' since my parser uses it?

function getImageAndWordCountFromHtml(html: string) {
	const $ = cheerio.load(html);
	const image = $('img').attr('src') || '';
	// get word count from cheerio root element - i get a type error here but not sure how to fix
	// const wordCount: number = $?.text().split(' ').length || -1;
	return { image, wordCount: -1 };
}

export function convertItemToArticle(item: Parser.Item): Prisma.ArticleCreateInput {
	const { image, wordCount } = getImageAndWordCountFromHtml(item.content);
	return {
		title: item.title || '',
		content: item.content || '',
		author: item.creator || '',
		url: item.guid || item.link || '',
		date: item.isoDate || '',
		image,
		wordCount,
	};
}

export async function getFeeds() {
	const feeds = await db.rssFeed.findMany({
		orderBy: [
			{
				createdAt: 'desc',
			},
		],
		include: {
			items: {
				include: {
					RssFeed: true,
					// RssFeed: {
					// 	select: {
					// 		id: true,
					// 		link: true,
					// 		imageUrl: true
					// 	}
					// }
				},
			},
		},
	});
	return feeds;
}
function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	if (value === null || value === undefined) return false;
	const testDummy: TValue = value;
	return true;
}

export async function getRefreshedFeeds() {
	const feeds = await getFeeds();
	if (!feeds.length) {
		return;
	}
	const parser = new Parser();
	console.log(`refreshing feeds`);
	console.time(`[feedRefresh]`);

	// const feeds = await fetchFeeds();
	// Limit to x most recent items

	// currently only filtering based on link - we should expand this
	const currentArticles = new Set(feeds.flatMap((feed) => feed.items.map((item) => item.uuid)));
	console.log({ currentArticles });
	// or should i get rssfeedItems to figure it out that way?

	// const currentArticles = new Set(articles.flatMap(article => article));

	// Promise.all better performance?
	const itemsToAdd = await Promise.all(
		feeds.map(async (feed) => {
			if (!feed.feedUrl) return;
			try {
				const dev = feed.title === 'A Working Library';
				const { items } = await parser.parseURL(feed.feedUrl);
				const itemsToAdd = items
					.map((item) => buildItem(feed.feedUrl, item, dev))
					.filter((item) => !currentArticles.has(item.uuid));
				console.log(`adding ${itemsToAdd.length} items to ${feed.title}`);
				if (itemsToAdd.length === 0) return;
				return itemsToAdd.map((item) => ({
					...item,
					rssFeedId: feed.id,
				}));
			} catch {
				console.log(`could not parse feed`, feed.feedUrl);
				return;
			}
		})
	);
	const filteredItems = itemsToAdd.flat().filter(notEmpty);
	const newItems = await db.$transaction(
		filteredItems.map((item) => {
			const id = item.rssFeedId;
			delete item.rssFeedId;
			return db.rssFeed.update({
				where: { id },
				data: {
					items: {
						createMany: {
							data: {
								...item,
							},
							skipDuplicates: true,
						},
					},
				},
			});
		})
	);
	// const newItems = await db.$transaction(
	// 	filteredItems.map((item) => db.rssFeedItem.create({ data: item }))
	// );
	console.timeEnd(`[feedRefresh]`);
	return newItems;
}

// return args for rssfeeditem
// TODO: flesh out build Item
export function buildItem(feedUrl: string, item: Parser.Item, log = false) {
	const uuid = buildId(feedUrl, item);
	if (log) {
		console.log({ uuid });
	}
	return {
		guid: item.guid || item.id,
		uuid,
		title: item.title,
		content: item['content_html'] || item['content:encoded'] || item.content,
		contentSnippet: item.contentSnippet,
		creator: item.creator || item.author,
		link: item.link,
		pubDate: dayjs(item.pubDate).format(),
		author: item.creator,
	};
}

// TODO: change this to take in my own parser
export function buildId(feedUrl: string, item: Parser.Item) {
	const parts: string[] = [];
	if (item.guid || item.link) {
		const id = uuid(item.guid || item.link);
		console.log(item.link, id);
	}
	parts.push(feedUrl);
	// parts.push(id.toString());
	if (item.guid) {
		parts.push(item.guid);
	} else {
		if (item.enclosure?.url) {
			parts.push(item.enclosure.url);
		} else if (item.link) {
			parts.push(item.link);
		} else if (item.pubDate) {
			parts.push(item.pubDate);
		} else if (item.title) {
			parts.push(item.title);
		}
	}
	return uuid(parts.filter((p) => p).join(''));
}

const xmlMimeTypes = ['application/rss+xml', 'application/atom+xml', 'text/xml', 'application/xml'];
export const isXml = (type: string) => xmlMimeTypes.some((t) => type.trim().includes(t));

const jsonMimeTypes = ['application/feed+json', 'application/json'];
export const isJson = (type: string) => jsonMimeTypes.some((t) => type.trim().includes(t));
const linkTypes = [
	'application/rss+xml',
	'application/atom+xml',
	'application/feed+json',
	'application/json',
];
export const linkSelectors = linkTypes
	.map((lt) => `link[rel="alternate"][type="${lt}"]`)
	.join(', ');

function isRelativeUrl(str: string) {
	return !/^https?:\/\//i.test(str);
}
export function resolveUrl(origin: string, url: string) {
	if (isRelativeUrl(url)) {
		return new URL(url, normalizeUrl(origin)).href;
	}
	return url;
}
