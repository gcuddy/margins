import { Prisma } from "@prisma/client";

export const basicEntrySelect = (userId: string) => Prisma.validator<Prisma.EntrySelect>()({
    id: true,
    title: true,
    uri: true,
    author: true,
    image: true,
    published: true,
    bookmarks: {
        where: {
            userId
        }
    }
})
