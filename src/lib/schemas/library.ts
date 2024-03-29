import { DocumentType, Status } from '$lib/types/enums';
import { z } from 'zod';

import { typeSchema } from '$lib/types';

import { tagSchema } from './objects/tag';
import {
	createArrayComparatorSchema,
	dateComparatorSchema,
	idComparatorSchema,
	intComparatorSchema,
	stringComparatorSchema,
} from './inputs/comparators';
import { defaultParseSearch } from '$lib/utils/search-params';

const defaultCursorSchema = z.object({
	id: z.number(),
	sort_order: z.number(),
});

// Only enabled if grouping is active. TODO make types more robust
const groupingCursorSchema = z.object({
	domain: z.string().optional(),
	tag: z.number().optional(),
	type: z.nativeEnum(DocumentType).optional(),
});

export const entryListSortSchemas = z
	.union([
		z.object({
			// order: z.nativeEnum(['asc', 'desc']),
			cursor: groupingCursorSchema.and(defaultCursorSchema).nullish(),

			sort: z.literal('manual').nullish(),
		}),
		z.object({
			cursor: groupingCursorSchema
				.extend({
					id: z.number(),
					updatedAt: z.coerce.date(),
				})
				.nullish(),
			sort: z.literal('updatedAt'),
		}),
		z.object({
			cursor: groupingCursorSchema
				.extend({
					createdAt: z.coerce.date(),
					id: z.number(),
				})
				.nullish(),
			sort: z.literal('createdAt'),
		}),
		z.object({
			cursor: groupingCursorSchema
				.extend({
					id: z.number(),
					title: z.string().nullable(),
				})
				.nullish(),
			// sort: z.nu
			sort: z.literal('title'),
		}),
		z.object({
			cursor: groupingCursorSchema
				.extend({
					author: z.string().nullable(),
					id: z.number(),
				})
				.nullish(),
			sort: z.literal('author'),
		}),
		z.object({
			cursor: groupingCursorSchema
				.extend({
					id: z.number(),
					time: z.number().nullable(),
				})
				.nullish(),
			sort: z.literal('time'),
		}),
		z.object({
			cursor: groupingCursorSchema
				.extend({
					id: z.number(),
					published: z.coerce.date().nullable(),
				})
				.nullish(),
			sort: z.literal('published'),
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

const baseFilterLibrarySchema = z
	.object({
		// For top level - if any is true, then we do or...
		any: z.boolean().optional(),
		author: z.string().or(createArrayComparatorSchema(z.string())),
		book_genre: z.enum(['Fiction', 'NonFiction']).optional(),
		createdAt: createdAtFilter.or(createdAtFilter.array()).optional(),
		domain: z.string().optional(),
		feed: createArrayComparatorSchema(z.number(), true).optional(),
		published: dateComparatorSchema,
		rating: z.literal('unrated').or(intComparatorSchema).optional(),
		readingTime: z.object({
			max: z.number().int().positive().optional(),
			min: z.number().int().positive().optional(),
		}),
		seen: z.coerce.boolean().optional().or(dateComparatorSchema),
		status: z
			.nativeEnum(Status)
			.or(createArrayComparatorSchema(z.nativeEnum(Status)))
			.optional(),
		tagColor: createArrayComparatorSchema(z.string()).optional(),
		tags: z.object({
			ids: z.number().int().positive().array(),
			type: z.enum(logicalOperators).optional(),
		}),
		title: stringComparatorSchema,
		type: typeSchema.nullish().or(createArrayComparatorSchema(typeSchema)),
	})
	.partial();

export type FilterLibrarySchema = z.input<typeof baseFilterLibrarySchema> & {
	and?: Array<FilterLibrarySchema>;
	or?: Array<FilterLibrarySchema>;
};

export const filterLibrarySchema: z.ZodType<FilterLibrarySchema> =
	baseFilterLibrarySchema
		.extend({
			and: z.lazy(() => filterLibrarySchema.array()),
			or: z.lazy(() => filterLibrarySchema.array()),
		})
		.partial();

/**
 * A Filter Library identity function for strong types.
 * Can be used e.g. to pass into defaultStringifySearch.
 */
export function filterLibrary(input: FilterLibrarySchema) {
	return input;
}

/**
 * A helper function to parse the search params into a FilterLibrarySchema.
 */

export function parseFilterFromSearchParams(
	search: string,
): FilterLibrarySchema | undefined {
	const rawObj = defaultParseSearch(search);
	console.log({ rawObj });
	const parsed = filterLibrarySchema.safeParse(rawObj);
	// console.log({ parsed });
	if (parsed.success) {
		return parsed.data;
	}
}

export const get_library_schema = z
	.object({
		filter: filterLibrarySchema.optional(),

		// Grouping is implemented as an additional sorting option, and then the UI completes it.  For instance, if we group by type, then we need all our types together (hence sorting). Additional layers of sorting will taker place "within" these groups. For no grouping, set to undefined.
		grouping: z.enum(['none', 'type', 'tag', 'domain']).optional(),

		/** Whether or not to use user's library. */
		library: z
			.boolean()
			.default(true)
			.or(z.enum(['library', 'subscriptions', 'all'])),

		// TODO: allow custom states
		search: z.string().optional(),

		status: z.nativeEnum(Status).nullable(),
	})
	.and(entryListSortSchemas);

export type GetLibrarySchema = z.input<typeof get_library_schema>;

export type LibrarySortType = GetLibrarySchema['sort'];
export type LibraryGroupType = GetLibrarySchema['grouping'];
