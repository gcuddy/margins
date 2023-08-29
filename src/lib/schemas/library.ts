import { typeSchema } from '$lib/types';
import { BookGenre, Status } from '@prisma/client';
import { z } from 'zod';
import { tagSchema } from './objects/tag';

const defaultCursorSchema = z.object({
	sort_order: z.number(),
	id: z.number(),
});

// Only enabled if grouping is active. TODO make types more robust
const groupingCursorSchema = z.object({
	type: typeSchema.optional(),
	tag: z.number().optional(),
	domain: z.string().optional(),
});

export const entryListSortSchemas = z
	.union([
		z.object({
			sort: z.literal('manual').nullish(),
			// order: z.nativeEnum(['asc', 'desc']),
			cursor: groupingCursorSchema.and(defaultCursorSchema).nullish(),
		}),
		z.object({
			sort: z.literal('updatedAt'),
			cursor: groupingCursorSchema
				.extend({
					updatedAt: z.coerce.date(),
					id: z.number(),
				})
				.nullish(),
		}),
		z.object({
			// sort: z.nu
			sort: z.literal('title'),
			cursor: groupingCursorSchema
				.extend({
					title: z.string(),
					id: z.number(),
				})
				.nullish(),
		}),
		z.object({
			sort: z.literal('author'),
			cursor: groupingCursorSchema
				.extend({
					author: z.string(),
					id: z.number(),
				})
				.nullish(),
		}),
		z.object({
			sort: z.literal('time'),
			cursor: groupingCursorSchema
				.extend({
					time: z.number().nullable(),
					id: z.number(),
				})
				.nullish(),
		}),
	])
	.and(
		z.object({
			dir: z.enum(['asc', 'desc']).optional(),
		}),
	);

const relativeDatesSchema = z.object({
	num: z.number().int().positive(),
	unit: z.enum(['day', 'week', 'month', 'year']),
});

const gte = z.object({
	gte: z.coerce.date().or(relativeDatesSchema),
});

const lte = z.object({
	lte: z.coerce.date().or(relativeDatesSchema),
});

const equals = z.object({
	equals: z.coerce.date(),
});

export const createdAtFilter = z.union([gte, lte, equals]);
export type CreatedAtFilter = z.infer<typeof createdAtFilter>;

export const logicalOperators = ['and', 'or'] as const;
export type LogicalOperator = (typeof logicalOperators)[number];

// tag schema
const entryTagFilter = tagSchema.partial();

export const filterLibrarySchema = z
	.object({
		createdAt: createdAtFilter.or(createdAtFilter.array()).optional(),
		type: typeSchema.nullish(),
		tags: z.object({
			ids: z.number().int().positive().array(),
			type: z.enum(logicalOperators).optional(),
		}),
		readingTime: z.object({
			min: z.number().int().positive().optional(),
			max: z.number().int().positive().optional(),
		}),
		domain: z.string().optional(),
        book_genre: z.enum(["Fiction", "NonFiction"]).optional(),
	})
	.partial();
export type FilterLibrarySchema = z.input<typeof filterLibrarySchema>;

export const get_library_schema = z
	.object({
		status: z.nativeEnum(Status).nullable(), // TODO: allow custom states
		search: z.string().optional(),
		filter: filterLibrarySchema.optional(),
		// Grouping is implemented as an additional sorting option, and then the UI completes it.  For instance, if we group by type, then we need all our types together (hence sorting). Additional layers of sorting will taker place "within" these groups. For no grouping, set to undefined.
		grouping: z.enum(['none', 'type', 'tag', 'domain']).optional(),
	})
	.and(entryListSortSchemas);

export type GetLibrarySchema = z.input<typeof get_library_schema>;

export type LibrarySortType = GetLibrarySchema['sort'];
export type LibraryGroupType = GetLibrarySchema['grouping'];
