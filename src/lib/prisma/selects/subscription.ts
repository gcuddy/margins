import { Prisma } from "@prisma/client";

export const basicSubscriptionSelect = Prisma.validator<Prisma.SubscriptionSelect>()({
    title: true,
    id: true,
    feedId: true,
    feed: {
        select: {
            imageUrl: true,
            link: true,
            feedUrl: true,
            id: true
        },
    },
    tags: true
})
