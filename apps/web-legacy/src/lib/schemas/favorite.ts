import { z } from "zod";

export const PinSchema: z = z.object({
	type: FavoriteTypeSchema,
	id: z.string().cuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	userId: z.string(),
	deleted: z.coerce.date().nullable(),
	tagId: z.number().int().nullable(),
	smartListId: z.number().int().nullable(),
	annotationId: z.string().nullable(),
	bookmarkId: z.number().int().nullable(),
	entryId: z.number().int().nullable(),
	feedId: z.number().int().nullable(),
	sortOrder: z.number().nullable(),
	/**
	 * The name of the folder. Only applies to favorites of type folder.
	 */
	folderName: z.string().nullable(),
	parentId: z.string().nullable(),
	collectionId: z.number().int().nullable()
});
