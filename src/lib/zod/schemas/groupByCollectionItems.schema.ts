import { z } from 'zod';
import { CollectionItemsWhereInputObjectSchema } from './objects/CollectionItemsWhereInput.schema';
import { CollectionItemsOrderByWithAggregationInputObjectSchema } from './objects/CollectionItemsOrderByWithAggregationInput.schema';
import { CollectionItemsScalarWhereWithAggregatesInputObjectSchema } from './objects/CollectionItemsScalarWhereWithAggregatesInput.schema';
import { CollectionItemsScalarFieldEnumSchema } from './enums/CollectionItemsScalarFieldEnum.schema';

export const CollectionItemsGroupBySchema = z.object({
	where: CollectionItemsWhereInputObjectSchema.optional(),
	orderBy: z.union([
		CollectionItemsOrderByWithAggregationInputObjectSchema,
		CollectionItemsOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: CollectionItemsScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(CollectionItemsScalarFieldEnumSchema),
});
