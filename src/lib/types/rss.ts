import { Prisma } from '@prisma/client';

// 1. Define a User type that includes the "cars" relation.
const rssItemWithFeed = Prisma.validator<Prisma.RssFeedItemArgs>()({
	include: { feed: true },
});

// 2: This type will include many users and all their cars
export type RssItemWithFeed = Prisma.RssFeedItemGetPayload<typeof rssItemWithFeed>;

// 1. Define a User type that includes the "cars" relation.
const rssFeedWithItems = Prisma.validator<Prisma.RssFeedArgs>()({
	include: {
		items: true,
	},
});

// 2: This type will include many users and all their cars
export type RssFeedWithItems = Prisma.RssFeedGetPayload<typeof rssFeedWithItems>;
