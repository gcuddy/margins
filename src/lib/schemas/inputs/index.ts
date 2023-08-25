import { z } from 'zod';
import {
	dateComparatorSchema,
	idComparatorSchema,
	stringComparatorSchema,
	uidComparatorSchema
} from './comparators';
import { AnnotationType } from '@prisma/client';

//should keys correspond to column names?
const baseCollectionFilterSchema = z
	.object({
		name: stringComparatorSchema,
		id: idComparatorSchema,
		createdAt: dateComparatorSchema,
		updatedAt: dateComparatorSchema
		// hasItems: z.boolean().optional()
	})
	.partial();

type CollectionFilter = z.infer<typeof baseCollectionFilterSchema> & {
	and?: CollectionFilter[];
	or?: CollectionFilter[];
};

export const collectionFilterSchema: z.ZodType<CollectionFilter> = baseCollectionFilterSchema
	.extend({
		and: z.lazy(() => collectionFilterSchema.array()),
		or: z.lazy(() => collectionFilterSchema.array())
	})
	.partial();

export const collectionsInputSchema = z.object({
	filter: collectionFilterSchema.optional(),
	cursor: z.coerce.date().nullish(),
	includeArchived: z.boolean().optional()
});

const baseNoteFilterSchema = z.object({
	title: stringComparatorSchema,
	id: uidComparatorSchema,
    /**
     * The content to search on — must extract and use with JSON Functions (see searchNotes)
     */
	content: z.string(),
    type: z.nativeEnum(AnnotationType)
}).partial();

type NoteFilter = z.infer<typeof baseNoteFilterSchema> & {
    and?: NoteFilter[];
    or?: NoteFilter[];
};

export const noteFilterSchema: z.ZodType<NoteFilter> = baseNoteFilterSchema.extend({
    and: z.lazy(() => noteFilterSchema.array()),
    or: z.lazy(() => noteFilterSchema.array())
}).partial();
