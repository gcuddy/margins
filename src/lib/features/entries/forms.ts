import { types } from '$lib/types';
import { BookmarkSchema } from '$lib/prisma/zod-prisma';
import { z } from 'zod';

const movieOrTvSchema = z.object({
	tmdbId: z.number(),
	type: z.enum(['movie', 'tv'])
});

const bookSchema = z.object({
	googleBooksId: z.string(),
	type: z.literal('book')
});

const podcastSchema = z.object({
	podcastIndexId: z.number(),
	type: z.literal('podcast')
});

const spotifySchema = z.object({
	spotifyId: z.string(),
	type: z.literal('album')
});

const entrySchema = z.object({
	entryId: z.number().int(),
	type: z.enum(['article', 'video', 'pdf', 'tweet'])
});

export const librarySchema = z
	.object({ entryId: z.number().int().optional() })
	.and(z.union([movieOrTvSchema, bookSchema, podcastSchema, spotifySchema, entrySchema]));

export type LibrarySchema = z.infer<typeof librarySchema>;

export const bookmarkSchema = z.object({
	id: z.number().optional(),
	entryId: z.number(),
	tmdbId: z.number().optional(),
	googleBooksId: z.string().optional(),
	podcastIndexId: z.number().optional(),
	spotifyId: z.string().optional(),
	type: z.enum(types).default('article')
});

export type BookmarkSchema = typeof bookmarkSchema;

export const tag = z.object({
	id: z.number().optional(),
	name: z.string().min(1).max(50)
});

export const tagSchema = z.object({
	tags: z.array(tag).default([])
});

export type TagSchema = typeof tagSchema;

export const updateBookmarkSchema = z
	.object({
		status: z.enum(['Backlog', 'Now', 'Archive'])
	})
	.partial();

export type UpdateBookmarkSchema = typeof updateBookmarkSchema;
