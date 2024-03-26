import { types } from '$lib/types';
import { Status } from '$lib/prisma/kysely/enums';
import { z } from 'zod';

// TODO: cover all types
export const entryIdAndTypeSchema = z.union([
	z.object({
		id: z.coerce.number(),
		type: z
			.enum(['entry', 'article', 'podcast', 'movie', 'tv'])
			.default('entry'),
	}),
	z.object({
		id: z.string(),
		type: z.enum(['album', 'book']),
	}),
]);

export const saveToLibrarySchema = z.object({
	bookmarkId: z.number().optional(),
	bookmarked_at: z.coerce.date().optional(),
	entryId: z.number().or(z.string()),
	// type modified ^^ entryid to be id of type
	type: z.enum(types),

	status: z.nativeEnum(Status).default('Backlog'),
});

export type SaveToLibrarySchema = typeof saveToLibrarySchema;
