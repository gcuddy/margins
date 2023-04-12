import { z } from "zod"

export const bookmarkSchema = z.object({
    id: z.number().optional()
})

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