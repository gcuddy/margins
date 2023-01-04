import { z } from 'zod';
import { CollectionWhereInputObjectSchema } from './objects/CollectionWhereInput.schema';
import { CollectionOrderByWithAggregationInputObjectSchema } from './objects/CollectionOrderByWithAggregationInput.schema';
import { CollectionScalarWhereWithAggregatesInputObjectSchema } from './objects/CollectionScalarWhereWithAggregatesInput.schema';
import { CollectionScalarFieldEnumSchema } from './enums/CollectionScalarFieldEnum.schema';

export const CollectionGroupBySchema = z.object({
	where: CollectionWhereInputObjectSchema.optional(),
	orderBy: z.union([
		CollectionOrderByWithAggregationInputObjectSchema,
		CollectionOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: CollectionScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(CollectionScalarFieldEnumSchema),
});
