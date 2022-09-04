import { stripEmptyTags, stripTags } from '$lib/utils/sanitize';
import type { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import getUuidByString from 'uuid-by-string';
dayjs.extend(localizedFormat);

import { XMLParser } from 'fast-xml-parser';
const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '',
});

export async function buildRssFeed({ url, xml }: { url: string; xml?: string }) {
	if (!xml) {
		xml = await fetch(url).then((res) => res.text());
	}
	//todo: json feed
	const parsedXml = parser.parse(xml);
	const data = parsedXml.rss?.channel || parsedXml.feed;
	return {
		title: data.title,
		link: data.link.href || data.link,
		description: await stripEmptyTags(data.description),
		imageUrl: data.image?.url || '',
		feedUrl: url,
		items: await Promise.all(
			(data.item || data.entry).map(async (item) => buildFeedItem(item, url))
		),
	};
}

const getText = (...items: any) => {
	for (const item of items) {
		if (typeof item === 'string') {
			return item;
		}
		if (item['#text']) {
			return item['#text'] as string;
		}
		if (Array.isArray(item)) {
			return item.map((i) => getText(i)).join(', ');
		}
	}
	return '';
};
export async function buildFeedItem(item: any, feedUrl: string) {
	const date = dayjs(item.pubDate).format('ll');
	const { link, title } = item;
	const image =
		item.enclosure?.type === 'image/jpeg'
			? item.enclosure.url
			: item['media:content']?.url || item['itunes:image']?.href || item['media:thumbnail']?.url;
	const description = await stripEmptyTags(
		getText(
			item.description,
			item.content,
			item['content:encoded'],
			item.summary,
			item['itunes:summary']
		)
	);
	return {
		title: title?.toString(),
		enclosure: item.enclosure,
		pubDate: dayjs(item.pubDate || item.published).format(),
		description,
		content: item.content?.['#text'] || item['content:encoded'] || description,
		contentSnippet: (await stripTags(description)).slice(0, 200),
		link,
		image,
		guid: item.guid?.['#text'],
		// getContent(element, ["creator", "dc:creator", "author", "author.name"]
		creator: getText(item['dc:creator'], item.creator, item.author, item.author?.name),
		uuid: buildId({ guid: item.guid?.['#text'], link, feedUrl }),
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
	if (typeof duration === 'number') {
		return duration;
	}
	if (!duration.includes(':')) {
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
