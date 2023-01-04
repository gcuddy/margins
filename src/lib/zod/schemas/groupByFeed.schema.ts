import { z } from 'zod';
import { FeedWhereInputObjectSchema } from './objects/FeedWhereInput.schema';
import { FeedOrderByWithAggregationInputObjectSchema } from './objects/FeedOrderByWithAggregationInput.schema';
import { FeedScalarWhereWithAggregatesInputObjectSchema } from './objects/FeedScalarWhereWithAggregatesInput.schema';
import { FeedScalarFieldEnumSchema } from './enums/FeedScalarFieldEnum.schema';

export const FeedGroupBySchema = z.object({
	where: FeedWhereInputObjectSchema.optional(),
	orderBy: z.union([
		FeedOrderByWithAggregationInputObjectSchema,
		FeedOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: FeedScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(FeedScalarFieldEnumSchema),
});
