dimport { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const userId = "clbyjr2730000qdczi941jvvs";
import PodcastIdxClient from "podcastdx-client";

import dayjs from "dayjs";

async function main() {
	const feeds = await prisma.feed.findMany({
		where: {
			podcastIndexId: {
				not: null,
			},
			subscriptions: {
				some: {
					userId,
				},
			},
		},
		select: {
			podcastIndexId: true,
			entries: true,
		},
	});
	const input = feeds.map((f) => f.podcastIndexId);
	// console.dir({ input }, { depth: null});
	const client = new PodcastIdxClient({
		key: "PQNXWJMNEKUCDDSDMMYP",
		secret: "D$euz2V58hN4E2Y4dN5C#fNtrNfdMHBxJFeXXkhb",
	});
	const { items } = await client.episodesByFeedId(input[0]);
	console.log({ items });
	const data = items.map((episode) => ({
		// podcastIndexId: episode.id,
		title: episode.title,
		published: dayjs.unix(episode.datePublished).toDate(),
		enclosureUrl: episode.enclosureUrl,
		enclosureType: episode.enclosureType,
		enclosureLength: episode.enclosureLength,
		summary: episode.description,
		duration: episode.duration,
		guid: episode.guid,
		original: JSON.stringify(episode),
		image: episode.image,
	}));
	console.log({ data });

	const feedToUpdate = await prisma.feed.update({
		where: {
			podcastIndexId: input[0],
		},
		data: {
			lastParsed: new Date(),
			entries: {
				createMany: {
					data,
				},
			},
		},
		include: {
			entries: true,
		},
	});
	console.dir({ feedToUpdate }, { depth: null });

	// console.log({ feedToUpdate, input: input[0] });
}

main();
