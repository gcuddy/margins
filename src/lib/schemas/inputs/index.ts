import { AnnotationType } from '$lib/types/enums';
import { z } from 'zod';

import {
	dateComparatorSchema,
	idComparatorSchema,
	stringComparatorSchema,
	uidComparatorSchema,
} from './comparators';

//should keys correspond to column names?
const baseCollectionFilterSchema = z
	.object({
		createdAt: dateComparatorSchema,
		id: idComparatorSchema,
		name: stringComparatorSchema,
		updatedAt: dateComparatorSchema,
		// hasItems: z.boolean().optional()
	})
	.partial();

type CollectionFilter = z.infer<typeof baseCollectionFilterSchema> & {
	and?: Array<CollectionFilter>;
	or?: Array<CollectionFilter>;
};

export const collectionFilterSchema: z.ZodType<CollectionFilter> =
	baseCollectionFilterSchema
		.extend({
			and: z.lazy(() => collectionFilterSchema.array()),
			or: z.lazy(() => collectionFilterSchema.array()),
		})
		.partial();

export const collectionsInputSchema = z.object({
	cursor: z.coerce.date().nullish(),
	filter: collectionFilterSchema.optional(),
	includeArchived: z.boolean().optional(),
});

const baseNoteFilterSchema = z
	.object({
		/**
		 * The content to search on — must extract and use with JSON Functions (see searchNotes)
		 */
		content: z.string(),

		id: uidComparatorSchema,

		title: stringComparatorSchema,
		type: z.nativeEnum(AnnotationType),
	})
	.partial();

type NoteFilter = z.infer<typeof baseNoteFilterSchema> & {
	and?: Array<NoteFilter>;
	or?: Array<NoteFilter>;
};

export const noteFilterSchema: z.ZodType<NoteFilter> = baseNoteFilterSchema
	.extend({
		and: z.lazy(() => noteFilterSchema.array()),
		or: z.lazy(() => noteFilterSchema.array()),
	})
	.partial();
