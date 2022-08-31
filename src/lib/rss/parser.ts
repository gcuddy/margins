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
	enclosure: { url },
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
	parts.push(url || link || '');
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
