import { stripEmptyTags, stripTags } from '$lib/utils/sanitize';
import type { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import getUuidByString from 'uuid-by-string';
dayjs.extend(localizedFormat);

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

export async function buildItem(
	item: any,
	feedUrl: string
): Promise<Partial<Prisma.RssFeedItemCreateInput>> {
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
	};
}
