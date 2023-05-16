import { types } from "$lib/types";
import { BookmarkSchema } from "$lib/prisma/zod-prisma";
import { z } from "zod"

export const bookmarkSchema = z.object({
    id: z.number().optional(),
    entryId: z.number(),
    tmdbId: z.number().optional(),
    googleBooksId: z.string().optional(),
    podcastIndexId: z.coerce.bigint().optional(),
    spotifyId: z.string().optional(),
    type: z.enum(types).default("article")
})

export type BookmarkSchema = typeof bookmarkSchema;

export const tag = z.object({
    id: z.number().optional(),
    name: z.string().min(1).max(50),
})


export const tagSchema = z.object({
    tags: z.array(tag).default([])
})

export type TagSchema = typeof tagSchema;


export const updateBookmarkSchema = z.object({
    status: z.enum(["Backlog", "Now", "Archive"]),
}).partial()

export type UpdateBookmarkSchema = typeof updateBookmarkSchema;