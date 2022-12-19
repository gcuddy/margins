import { Prisma } from '@prisma/client';

const subscriptionWithFeed = Prisma.validator<Prisma.SubscriptionArgs>()({
	include: {
		feed: {
			include: {
				entries: {
					include: {
						interactions: true,
					},
				},
			},
		},
	},
});

// 2: This type will include many users and all their cars
export type SubscriptionWithFeed = Prisma.SubscriptionGetPayload<typeof subscriptionWithFeed>;
