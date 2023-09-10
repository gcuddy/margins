import { Status } from '@prisma/client';
import { z } from 'zod';

import { collectionItemSchema } from './collection.schema';

const urlInput = z.object({
	entryId: z.undefined(),
	url: z.string(),
});

const entryIdInput = z.object({
	entryId: z.number().int(),
	url: z.undefined(),
});

const urlOrEntryIdInput = z
	.union([urlInput, entryIdInput])
	.refine(
		(input) => input.entryId || input.url,
		'Either entryId or url must be provided',
	);

export const bookmarkCreateInput = z
	.object({
		// The collection ID to add the entry to, if any
		collection: collectionItemSchema.optional(),
		entryId: z.number().int().optional(),
		relatedEntryId: z.number().int().optional(),
		// If null, don't add to library
		status: z.nativeEnum(Status).nullable().default('Backlog'),
		url: z.string().optional(),
	})
	.and(urlOrEntryIdInput);

export type BookmarkCreateInput = z.input<typeof bookmarkCreateInput>;

export const BookmarkSchema = z.object({
	author: z.string().nullable(),
	bookmarked: z.boolean(),
	context: z.any().optional(),
	createdAt: z.coerce.date(),
	data: z.any().optional(),
	deleted: z.coerce.date().nullable(),
	dueDate: z.coerce.date().nullable(),
	entryId: z.number().int().nullable(),
	favoriteId: z.number().int().nullable(),
	id: z.number().int(),

	interactionId: z.number().int().nullable(),

	is_read: z.boolean(),

	/**
	 * The original url of the bookmark, if it's different than the entry's url
	 */
	originalUrl: z.string().nullable(),

	pdf_url: z.string().nullable(),

	private: z.boolean(),

	progress: z.number(),

	/**
	 * The timestamp that this content should be next seen, ala SRS. It can be user-set or via algorithm. Different than due, similar to snooze.
	 */
	review_timestamp: z.number().int().nullable(),

	screenshot: z.string().nullable(),

	snoozedUntil: z.coerce.date().nullable(),

	sortOrder: z.number().int().nullable(),

	sort_order: z.number().int(),

	source: z.string().nullable(),

	stateId: z.number().int().nullable(),
	status: z.nativeEnum(Status),
	title: z.string().nullable(),

	updatedAt: z.coerce.date(),
	uri: z.string().nullable(),
	userId: z.string(),
});
