import * as z from 'zod';
import { Status } from '@prisma/client';

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const BookmarkModel = z.object({
	id: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
	uri: z.string().nullish(),
	entryId: z.number().int().nullish(),
	userId: z.string(),
	sortOrder: z.number().int().nullish(),
	data: jsonSchema,
	stateId: z.number().int().nullish(),
	private: z.boolean(),
	interactionId: z.number().int().nullish(),
	favoriteId: z.number().int().nullish(),
	deleted: z.date().nullish(),
	is_read: z.boolean(),
	progress: z.number(),
	context: jsonSchema,
	screenshot: z.string().nullish(),
	source: z.string().nullish(),
	dueDate: z.date().nullish(),
	snoozedUntil: z.date().nullish(),
	/**
	 * The original url of the bookmark, if it's different than the entry's url
	 */
	originalUrl: z.string().nullish(),
	status: z.nativeEnum(Status).nullish(),
	sort_order: z.number().int(),
	/**
	 * The timestamp that this content should be next seen, ala SRS. It can be user-set or via algorithm. Different than due, similar to snooze.
	 */
	review_timestamp: z.number().int().nullish(),
	title: z.string().nullish(),
	author: z.string().nullish(),
	pdf_url: z.string().nullish(),
	rating: z.number().int().nullish(),
	seen_at: z.date().nullish(),
	bookmarked_at: z.date().nullish(),
});
