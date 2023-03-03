import { Prisma } from "@prisma/client";

export const basicEntrySelect = (userId: string) => Prisma.validator<Prisma.EntrySelect>()({
    id: true,
    title: true,
    uri: true,
    author: true,
    image: true,
    published: true,
    type: true,
    bookmarks: {
        where: {
            userId
        }
    }
})


export const entryListSelect = (userId: string) => Prisma.validator<Prisma.EntrySelect>()({
    id: true,
    title: true,
    author: true,
    // html: true,
    screenshot: true,
    image: true,
    type: true,
    enclosureUrl: true,
    duration: true,
    uri: true,
    published: true,
    summary: true,
    createdAt: true,
    feedId: true,
    updatedAt: true,
    annotations: {
        where: {
            // type: 'note',
            userId,
        },
    },
    tags: {
        select: {
            id: true,
            name: true
        },
        where: {
            userId
        }
    },
    bookmarks: {
        where: {
            userId,
        },
        include: {
            state: true,
        },
    },
    interactions: {
        where: {
            userId
        }
    },
    feed: {
        select: {
            id: true,
            title: true
        }
    },
    relations: true,
    back_relations: true,
})

const entryInListArgs = Prisma.validator<Prisma.EntryArgs>()({
    select: entryListSelect(''),
})

export type EntryInList = Prisma.EntryGetPayload<typeof entryInListArgs>

export const entriesThatBelongToUser = (userId: string, {
    bookmarks,
    feeds,
} = {
        bookmarks: true,
        feeds: true
    }) => Prisma.validator<Prisma.EntryWhereInput>()({
        OR: [
            {
                bookmarks: bookmarks
                    ? {
                        some: {
                            userId,
                        },
                    }
                    : undefined,
            },
            {
                feed: feeds
                    ? {
                        subscriptions: {
                            some: {
                                userId,
                            },
                        },
                    }
                    : undefined,
            },
        ]
    })
