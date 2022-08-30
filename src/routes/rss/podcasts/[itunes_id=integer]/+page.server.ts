import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { XMLParser } from 'fast-xml-parser';
import { stripEmptyTags, stripTags } from '$lib/utils/sanitize';
import { buildItem } from '../parser';
import { db } from '$lib/db';
const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '',
});

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	console.time('loadPodcast');
	const id = Number(params.itunes_id);

	setHeaders({
		'cache-control': 'private, max-age=300',
	});

	const { results } = JSON.parse(
		await fetch(`https://itunes.apple.com/lookup?id=${id}`).then((res) => res.text())
	);
	const data = results[0];
	if (data.kind !== 'podcast') {
		throw error(400, 'not a podcast');
	}
	const { feedUrl, artworkUrl100, artistName, collectionName, releaseDate } = data;
	// now fetch and parse the feed
	const xml = parser.parse(await fetch(feedUrl).then((res) => res.text()));
	if (xml.rss?.['xmlns:itunes'] !== 'http://www.itunes.com/dtds/podcast-1.0.dtd') {
		throw error(400, 'malformed podcast feed');
	}

	const items = await Promise.all(
		xml.rss.channel.item.map(async (item) => buildItem(item, feedUrl))
	);
	const podcast_object = {
		id,
		title: xml.rss.channel.title,
		description: await stripEmptyTags(xml.rss.channel.description),
		imageUrl: xml.rss.channel.image?.url,
		// 		todo: parse items
		creator: xml.rss.channel['itunes:author'],
		feedUrl,
		podcast: true,
		items: {
			createMany: {
				data: items,
				skipDuplicates: true,
			},
		},
	};
	console.log(`items - ${items.length}`);
	console.log({ items });
	// todo: get user id from session
	const podcast = await db.rssFeed.upsert({
		where: {
			feedUrl,
		},
		create: podcast_object,
		update: podcast_object,
		include: {
			items: {
				select: {
					title: true,
					description: true,
					duration: true,
					pubDate: true,
					guid: true,
					enclosure: true,
					id: true,
				},
				orderBy: {
					pubDate: 'desc',
				},
			},
		},
	});

	// const existing = await db.rssFeed.findFirst({
	// 	where: {
	// 		itunes_id: id,
	// 	},
	// 	include: {
	// 		// hmmmm
	// 		PodcastEpisode: {
	// 			include: {
	// 				PodcastEpisodeInteraction: true,
	// 			},
	// 		},
	// 	},
	// });

	// create
	// await db.podcastEpisode.createMany({
	//   data: items.map(i => {

	//   })
	//   skipDuplicates: true,
	// })
	console.timeEnd('loadPodcast');

	return {
		...podcast,
	};
};
