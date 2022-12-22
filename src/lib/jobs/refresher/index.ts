// refresh feeds using interactive transactions via prismas

// questions about how to scale this/whether i need some sort of job thingy

// for now let's just write out the basics.
import { DocumentType, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { XMLParser } from 'fast-xml-parser';
import parse from 'node-html-parser';

import { db } from '$lib/db';
import { isXml } from '$lib/rss/utils';

// TODO: type for this
const feedSelect = Prisma.validator<Prisma.FeedSelect>()({
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
	attributeNamePrefix: '',
});
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

export const getImageFromHtml = (html: string) => {
	const doc = parse(html);
	let img: string | undefined = undefined;
	doc.querySelectorAll('img, iframe, video').forEach((el) => {
		// TODO next... get first image (pass into other stuff)
		if (img) {
			return img;
		}
		switch (el.tagName) {
			case 'IMG': {
				img = el.getAttribute('src');
				break;
			}
			case 'IFRAME': {
				img = el.getAttribute('src');
				break;
			}
			case 'VIDEO': {
				img = el.getAttribute('poster');
				break;
			}
		}
	});
	return img;
};

const getText = (...items: any): string => {
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
export async function refresh({ feed_ids }: { feed_ids?: number[] }) {
	const feeds = await db.feed.findMany({
		where: {
			active: true,
			subscriptions: {
				some: {},
			},
		},
		select: feedSelect,
	});
	const toAdd = await Promise.all(
		feeds
			.flatMap(async (feed) => {
				const entries = await getUpdatedEntries(feed);
				if (entries) {
					return entries;
				} else {
					return [{}]
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

	try {
		const created = await db.entry.createMany({
			skipDuplicates: true,
			data: entriesToAdd,
		});
		console.log({ created });
	} catch (e) {
		console.error(e);
	}
}

// hoist this
function parseXml(xml: string) {
	const parsedXml = parser.parse(xml);
	const data = parsedXml.rss?.channel || parsedXml.feed;
	return data;
}
async function getUpdatedEntries(feed: FeedToUpdate) {
	const uris = feed.entries.map((e) => e.uri).filter((e) => e) as string[];
	const guids = feed.entries.map((e) => e.guid).filter((e) => e) as string[];
	console.log({ uris, guids });
	try {
		const response = await fetch(feed.feedUrl);
		const body = await response.text();
		const contentType = response.headers.get('content-type');
		console.log(`checking for updates in ${feed.feedUrl}`);
		if ((contentType && isXml(contentType)) || body.trim().startsWith('<?xml')) {
			// If the type is XML...
			console.log(`xml`);
			const data = parseXml(body);
			const items: ReturnType<typeof createEntry>[] = (data.items || data.item || data.entry)
				.slice(0, 20)
				// filter out items we already have
				// TODO: in future, don't do this and instead check for updates
				.filter((item) => {
					const uri = getLink(item.link);
					console.log({ uri });
					if (uris.includes(uri)) {
						console.log('got this uri already');
						return false;
					}
					let guid: string | undefined = undefined;
					if (item.guid) {
						guid = getText(item.guid);
					} else if (item.id) {
						guid = getText(item.id);
					}
					if (guid && guids.includes(guid)) {
						console.log(`got ${guid} already`);
						return false;
					}
					return true;
				})
				.map((entry) => {
					console.log({ entry });
					let guid: string | undefined = undefined;
					if (entry.guid) {
						guid = getText(entry.guid);
					} else if (entry.id) {
						guid = getText(entry.id);
					}
					const published = entry.published || entry.pubDate || entry.pubdate;
					console.log({ published });
					const description = getText(entry.summary, entry.description);
					console.log({ description });
					const html = getText(entry.content, entry['content:encoded']) || description;
					return createEntry(feed.id, {
						title: getText(entry.title),
						type: DocumentType.rss,
						uri: getLink(entry.link),
						image: getImageFromHtml(entry.content),
						guid,
						html,
						published: dayjs(published).isValid() ? dayjs(published).format() : undefined,
						updated: entry.updated,
						author: getText(entry.author?.name),
						summary: html === description ? undefined : description,
					});
				});
			console.log(items[0]);
			return items;
		} else {
			return [];
		}
	} catch (e) {
		console.error('Error fetching feed: ' + feed.feedUrl);
		return;
	}
}

const createEntry = (
	feedId: number,
	{ title, type, uri, guid, html, published, updated, author, summary }: Prisma.EntryCreateInput
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
		feedId,
	});
};
