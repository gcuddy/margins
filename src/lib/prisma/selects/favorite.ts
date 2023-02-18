import { Prisma } from "@prisma/client";

export const baseFavoriteSelect = Prisma.validator<Prisma.FavoriteSelect>()({
    entry: true,
    tag: true,
    feed: true,
    smartList: true,
    id: true,
    annotation: true,
    collection: true,
    collectionId: true,
    folderName: true,
    children: true,
    // parent: true,
    type: true,
    sortOrder: true,
})

export const rootFavoriteSelect = Prisma.validator<Prisma.FavoriteSelect>()({
    ...baseFavoriteSelect,
    children: {
        select: {
            ...baseFavoriteSelect,
        }
    }
});

const rootFavorite = Prisma.validator<Prisma.FavoriteArgs>()({
    select: rootFavoriteSelect,
})

export type RootFavorite = Prisma.FavoriteGetPayload<typeof rootFavorite>;