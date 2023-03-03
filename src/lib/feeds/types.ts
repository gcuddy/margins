import { Prisma } from '@prisma/client';

export const subscriptionApiSelect = Prisma.validator<Prisma.SubscriptionSelect>()({
	id: true,
	feedId: true,
	title: true,
	createdAt: true,
	// TODO: extended json_feed
	feed: {
		select: {
			feedUrl: true,
			link: true,
		},
	},
});
