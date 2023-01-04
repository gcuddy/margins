import { z } from 'zod';
import { BookmarkWhereInputObjectSchema } from './objects/BookmarkWhereInput.schema';
import { BookmarkOrderByWithAggregationInputObjectSchema } from './objects/BookmarkOrderByWithAggregationInput.schema';
import { BookmarkScalarWhereWithAggregatesInputObjectSchema } from './objects/BookmarkScalarWhereWithAggregatesInput.schema';
import { BookmarkScalarFieldEnumSchema } from './enums/BookmarkScalarFieldEnum.schema';

export const BookmarkGroupBySchema = z.object({
	where: BookmarkWhereInputObjectSchema.optional(),
	orderBy: z.union([
		BookmarkOrderByWithAggregationInputObjectSchema,
		BookmarkOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: BookmarkScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(BookmarkScalarFieldEnumSchema),
});
