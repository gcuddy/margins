import { z } from 'zod';
import { FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/FeedOrderByWithRelationAndSearchRelevanceInput.schema';
import { FeedWhereInputObjectSchema } from './objects/FeedWhereInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './objects/FeedWhereUniqueInput.schema';
import { FeedScalarFieldEnumSchema } from './enums/FeedScalarFieldEnum.schema';

export const FeedFindFirstSchema = z.object({
	orderBy: z
		.union([
			FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: FeedWhereInputObjectSchema.optional(),
	cursor: FeedWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	distinct: z.array(FeedScalarFieldEnumSchema).optional(),
});
