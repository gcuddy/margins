import { typeSchema } from '$lib/types';
import { Status } from '@prisma/client';
import { z } from 'zod';


const defaultCursorSchema = z.object({
	sort_order: z.number(),
	updatedAt: z.coerce.date()
});

const entryListSortSchemas = z.union([
	z.object({
		sort: z.literal('manual').nullish(),
		// order: z.nativeEnum(['asc', 'desc']),
		cursor: defaultCursorSchema.nullish()
	}),
	z.object({
		sort: z.literal('updatedAt'),
		cursor: z
			.object({
				updatedAt: z.coerce.date(),
				id: z.number()
			})
			.nullish()
	}),
	z.object({
		// sort: z.nu
		sort: z.literal('title'),
		cursor: z
			.object({
				title: z.string(),
				id: z.number()
			})
			.nullish()
	}),
	z.object({
		sort: z.literal('author'),
		cursor: z
			.object({
				author: z.string(),
				id: z.number()
			})
			.nullish()
	})
]);

const relativeDatesSchema = z.object({
	num: z.number().int().positive(),
	unit: z.enum(['day', 'week', 'month', 'year'])
});

const gte = z.object({
	gte: z.coerce.date().or(relativeDatesSchema)
});

const lte = z.object({
	lte: z.coerce.date().or(relativeDatesSchema)
});

const equals = z.object({
	equals: z.coerce.date()
});

export const createdAtFilter = z.union([gte, lte, equals])

export const filterLibrarySchema = z.object({
	createdAt: createdAtFilter.optional()
});
export type FilterLibrarySchema = z.input<typeof filterLibrarySchema>;

export const get_library_schema = z
	.object({
		status: z.nativeEnum(Status).nullable(), // TODO: allow custom states
		search: z.string().optional(),
		type: typeSchema.nullish(),
		filter: filterLibrarySchema.optional()
	})
	.and(entryListSortSchemas);

export type GetLibrarySchema = z.input<typeof get_library_schema>;

export type LibrarySortType = GetLibrarySchema['sort'];
