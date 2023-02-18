import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const userId = "clbyjr2730000qdczi941jvvs";
import PodcastIdxClient from "podcastdx-client";

import dayjs from "dayjs";

async function main() {
	const client = new PodcastIdxClient({
		key: "PQNXWJMNEKUCDDSDMMYP",
		secret: "D$euz2V58hN4E2Y4dN5C#fNtrNfdMHBxJFeXXkhb",
	});

	const feeds = await prisma.feed.findMany({
		where: {
			podcastIndexId: {
				not: null,
			},
		},
	});

	// now get feeds and update
	// REVIEW: this is slow way vs bulk transactions
	for (const feed of feeds) {
		const { feed: podcast } = await client.podcastById(feed.podcastIndexId);
		await prisma.feed.update({
			where: {
				id: feed.id,
			},
			data: {
				title: podcast.title,
				podcastIndexId: podcast.id,
				podcast: true,
				imageUrl: podcast.artwork,
				lastParsed: dayjs.unix(podcast.lastParseTime).toDate(),
				link: podcast.link,
				feedUrl: podcast.url,
				description: podcast.description,
				// guid: podcast.podcastGuid,
				podcastIndexData: podcast,
				itunesId: podcast.itunesId,
			},
		});
	}
}

main();
