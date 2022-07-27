import type Parser from 'rss-parser';
import { parse } from 'node-html-parser';
import normalizeUrl from 'normalize-url';
const linkTypes = [
	'application/rss+xml',
	'application/atom+xml',
	'application/feed+json',
	'application/json'
];
const rssTypes = [
	'application/rss+xml',
	'application/atom+xml',
	'application/rdf+xml',
	'application/rss',
	'application/atom',
	'application/rdf',
	'text/rss+xml',
	'text/atom+xml',
	'text/rdf+xml',
	'text/rss',
	'text/atom',
	'text/rdf'
];

const xmlMimeTypes = ['application/rss+xml', 'application/atom+xml', 'text/xml', 'application/xml'];
const jsonMimeTypes = ['application/feed+json', 'application/json'];
const isXml = (type: string) => xmlMimeTypes.some((t) => type.trim().includes(t));
const isJson = (type: string) => jsonMimeTypes.some((t) => type.trim().includes(t));
const createLinkSelector = (type: string) => `link[rel="alternate"][type="${type}"]`;
const linkSelectors = linkTypes.map((lt) => `link[rel="alternate"][type="${lt}"]`).join(', ');

// a minute
// const TTL_MS = 60 * 1000;
// const endpointCache = new Keyv(,{
// 	namespace: 'rss',
// 	ttl: TTL_MS
// });
// store this in redis or postgres?

interface Cached {
	body: string;
	contentType: string | null;
}

const fetchAndSave = async (url: string) => {
	// const cached: Cached = await endpointCache.get(url);
	// if (cached) {
	// 	console.log('found in cache');
	// 	return cached;
	// }
	// TODO: set up caching
	console.log('not found in cache, fetching');
	const response = await fetch(url);
	const body = await response.text();
	const contentType = response.headers.get('content-type');
	// await endpointCache.set(url, { body, contentType });
	console.log('saved to cache');
	return { body, contentType };
};

export interface RSSFeed extends Parser.Item {
	favicon?: string;
	feedUrl: string;
}

// export async function parseRss(url: string): Promise<RSSFeed[]> {
// 	try {
// 		const { body, contentType } = await fetchAndSave(url);
// 		// const contentType = res.headers.get('content-type');
// 		if (contentType && isXml(contentType)) {
// 			console.log('xml');
// 			const item = await parseXMLOrJSON(body, 'xml');
// 			return [{ ...item, feedUrl: url }];
// 		} else if (contentType && isJson(contentType)) {
// 			// console.log('JSON Found - right now only XML is supported');
// 			const item = await parseXMLOrJSON(body, 'json');
// 			return [{ ...item, feedUrl: url }];
// 		} else {
// 			// todo: use node-html-parser instead
// 			const $ = cheerio.load(body);
// 			const links = $(linkSelectors).toArray();
// 			const feeds = await Promise.all(
// 				links.map(async (link) => {
// 					// for each, fetch the link and parse the feed
// 					if (link.type === 'tag') {
// 						const _url = new URL(link.attribs.href, url);
// 						const which = link.attribs.type.includes('xml') ? 'xml' : 'json';
// 						const { body: _body } = await fetchAndSave(_url.href);
// 						const item = await parseXMLOrJSON(_body, which);
// 						return {
// 							...item,
// 							feedUrl: _url.href
// 						};
// 					}
// 				})
// 			);
// 			return feeds.filter((f) => f) as RSSFeed[];
// 		}
// 	} catch (e) {
// 		console.log(e);
// 		return [];
// 	}
// }

export interface FeedUrl {
	title: string;
	url: string;
}

type ParsedFeed = TODO;

function isRelativeUrl(str: string) {
	return !/^https?:\/\//i.test(str);
}

function resolveUrl(origin: string, url: string) {
	if (isRelativeUrl(url)) {
		console.log('relati');
		return new URL(url, normalizeUrl(origin)).href;
	}
	return url;
}

export async function findRss(url: string): Promise<FeedUrl[] | CreateFeedWithItems[] | undefined> {
	try {
		const { body, contentType } = await fetchAndSave(url);
		if (contentType && (isXml(contentType) || isJson(contentType))) {
			console.log('xml');
			const item = await fetchFeed(url);
			console.log('found the feed, here it is: ', item);
			if (item) {
				return [item];
			}
		} else {
			// then let's find the feeds in the body
			const root = parse(body);
			const links = root.querySelectorAll(linkSelectors);
			const feedUrls: FeedUrl[] = links.map((link) => ({
				url: resolveUrl(url, link.attributes.href),
				title: link.attributes.title
			}));
			if (feedUrls.length === 0) {
				// then actually parse out
				const feed = await fetchFeed(url);
				if (feed) {
					return [feed];
				}
			} else {
				const feeds: CreateFeedWithItems[] = [];
				for (const feed of feedUrls) {
					const item = await fetchFeed(feed.url);
					if (item) {
						feeds.push(item);
					}
				}
				return feeds;
			}
		}
	} catch (e) {
		console.log(e);
		return [];
	}
}

// const iconRels = ['icon', 'shortcut icon'];

const favIconRels = ['shortcut icon', 'icon', 'apple-touch-icon', 'apple-touch-icon-precomposed'];

export interface Feed {
	feeds: {
		title: string;
		url: string;
	}[];
	favicon?: string;
}

// https://github.com/ggkovacs/rss-finder/blob/master/lib/parser.js

// TODO: Add support for JSON feed
// async function parseOutRssFeeds(htmlBody: string, url: string) {
// 	const $ = cheerio.load(htmlBody);
// 	const links = $(rssTypes.map((l) => createLinkSelector(l)).join(', ')).toArray();
// 	const _links = (
// 		await Promise.all(
// 			links.map((link) => {
// 				if (link.type === 'tag') {
// 					const _url = new URL(link.attribs.href, url);
// 					const _title = link.attribs.title || link.attribs.href;
// 					return {
// 						title: _title,
// 						url: _url.href
// 					};
// 				}
// 			})
// 		)
// 	).filter((l) => l);
// 	const favicon = $(favIconRels.map((l) => `link[rel="${l}"]`).join(', ')).attr('href');
// 	return {
// 		feeds: _links,
// 		favicon
// 	};
// }

export async function findRssFeeds(url: string) {
	try {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`${res.status} ${res.statusText}`);
		}
		const contentType = res.headers.get('content-type');
		if (contentType && (isXml(contentType) || isJson(contentType))) {
			console.log('direct xml/json - deal with this');
		} else {
			return parseOutRssFeeds(await res.text(), url);
		}
	} catch (e) {
		console.log(e);
	}
}
