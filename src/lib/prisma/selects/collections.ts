import { Prisma } from "@prisma/client";

import { basicEntrySelect } from "./entry";

export const childInclude = (userId: string) => Prisma.validator<Prisma.CollectionItemsInclude>()({
    entry: {
        select: basicEntrySelect(userId)
    },
    annotation: true
})

export const childArgs = (userId: string) => Prisma.validator<Prisma.CollectionItems$childrenArgs>()({
    include: childInclude(userId),
    orderBy: {
        position: 'asc'
    }
})



// WATCH OUT: THIS THING IS HORRID!!
export const collectionItemSelect = (userId: string, children: 0 | 1 | 2 | 3 | 4 | 5 = 1) => Prisma.validator<Prisma.CollectionItemsArgs>()({
    select: {
        id: true,
        updatedAt: true,
        title: true,
        position: true,
        note: true,
        type: true,
        entry: {
            select: basicEntrySelect(userId)
        },
        annotation: true,
        children: children > 0 ? {
            include: {
                ...childInclude(userId),
                children: children > 1 ? {
                    include: {
                        ...childInclude(userId),
                        children: children > 2 ? {
                            include: {
                                ...childInclude(userId),
                                children: children > 3 ? {
                                    include: {
                                        ...childInclude(userId),
                                        children: children > 4 ? {
                                            include: childInclude(userId),
                                            orderBy: {
                                                position: 'asc'
                                            }
                                        } : undefined
                                    },
                                    orderBy: {
                                        position: 'asc'
                                    }
                                } : undefined
                            },
                            orderBy: {
                                position: 'asc'
                            }
                        } : undefined,
                    },
                    orderBy: {
                        position: 'asc'
                    }
                } : undefined,
            },
            orderBy: {
                position: 'asc'
            }
        } : undefined,
    },
})
