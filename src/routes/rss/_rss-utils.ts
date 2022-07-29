import type { Article, Prisma, PrismaPromise, RssFeed } from '@prisma/client';
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
		wordCount
	};
}

export async function getFeeds() {
	const feeds = await db.rssFeed.findMany({
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		include: {
			items: {
				include: {
					RssFeed: true
					// RssFeed: {
					// 	select: {
					// 		id: true,
					// 		link: true,
					// 		imageUrl: true
					// 	}
					// }
				}
			}
		}
	});
	return feeds;
}

export async function getRefreshedFeeds(): Promise<RssFeedWithItems[]> {
	const feeds = await getFeeds();
	if (!feeds.length) {
		return feeds;
	}
	const parser = new Parser();
	console.log(`refreshing feeds`);
	console.time(`[feedRefresh]`);

	// const feeds = await fetchFeeds();
	// Limit to x most recent items

	// currently only filtering based on link - we should expand this
	const currentArticles = new Set(feeds.flatMap((feed) => feed.items.map((item) => item.uuid)));
	// or should i get rssfeedItems to figure it out that way?

	// const currentArticles = new Set(articles.flatMap(article => article));

	// I know this is almost definitely not the best way to do this... right?

	const transactions: PrismaPromise<any>[] = [];
	for (const feed of feeds) {
		if (!feed.feedUrl) continue;
		const { items } = await parser.parseURL(feed.feedUrl);
		const itemsToAdd = items
			.map((item) => buildItem(feed.feedUrl, item))
			.filter((item) => !currentArticles.has(item.uuid));
		console.log(`adding ${itemsToAdd.length} items to ${feed.title}`);
		if (itemsToAdd.length === 0) continue;
		// abstract this out to a function in its own file
		// not sure what the most efficient way to do this is - keep thinking about it

		transactions.push(
			db.rssFeedItem.createMany({
				data: itemsToAdd.map((item) => {
					return {
						...item,
						rssFeedId: feed.id
					};
				})
			})
		);
	}
	// this is no good... have to repeat this again??
	transactions.push(
		db.rssFeed.findMany({
			include: {
				items: {
					include: {
						RssFeed: true
					}
				}
			}
		})
	);
	const items = await db.$transaction(transactions);
	console.log(`refreshed items`, { items });
	const updatedFeeds = items.pop();
	console.log({ updatedFeeds });
	console.timeEnd(`[feedRefresh]`);
	return updatedFeeds;
}

// return args for rssfeeditem
// TODO: flesh out build Item
export function buildItem(feedUrl: string, item: Parser.Item) {
	const uuid = buildId(feedUrl, item);
	return {
		guid: item.guid || item.id,
		uuid,
		title: item.title,
		content: item['content_html'] || item['content:encoded'] || item.content,
		contentSnippet: item.contentSnippet,
		creator: item.creator || item.author,
		link: item.link,
		pubDate: dayjs(item.pubDate).format(),
		author: item.creator
	};
}

// TODO: change this to take in my own parser
export function buildId(feedUrl: string, item: Parser.Item) {
	const parts: string[] = [];
	parts.push(feedUrl);
	// parts.push(id.toString());
	if (item.guid) {
		parts.push(item.guid);
	} else {
		if (item.enclosure?.url) {
			parts.push(item.enclosure.url);
		} else if (item.link) {
			parts.push(item.link);
		}
		if (item.title) parts.push(item.title);
		if (item.pubDate) parts.push(item.pubDate);
	}
	return uuid(parts.filter((p) => p).join(''));
}

const xmlMimeTypes = ['application/rss+xml', 'application/atom+xml', 'text/xml', 'application/xml'];
export const isXml = (type: string) => xmlMimeTypes.some((t) => type.trim().includes(t));
const linkTypes = [
	'application/rss+xml',
	'application/atom+xml',
	'application/feed+json',
	'application/json'
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
