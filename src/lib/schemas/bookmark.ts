import { Status } from '$lib/types/enums';
import { z } from 'zod';

export type BookmarkCreateInput = z.input<typeof bookmarkCreateInput>;

export const BookmarkSchema = z.object({
	author: z.string().nullable(),
	bookmarked_at: z.coerce.date(),
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

	seen_at: z.coerce.date().nullable(),

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
