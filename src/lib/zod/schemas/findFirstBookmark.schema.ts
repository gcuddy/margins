import { z } from 'zod';
import { BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/BookmarkOrderByWithRelationAndSearchRelevanceInput.schema';
import { BookmarkWhereInputObjectSchema } from './objects/BookmarkWhereInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './objects/BookmarkWhereUniqueInput.schema';
import { BookmarkScalarFieldEnumSchema } from './enums/BookmarkScalarFieldEnum.schema';

export const BookmarkFindFirstSchema = z.object({
	orderBy: z
		.union([
			BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: BookmarkWhereInputObjectSchema.optional(),
	cursor: BookmarkWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(BookmarkScalarFieldEnumSchema).optional(),
});
