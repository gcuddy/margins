import { z } from 'zod';
import { ContextNodeWhereInputObjectSchema } from './objects/ContextNodeWhereInput.schema';
import { ContextNodeOrderByWithAggregationInputObjectSchema } from './objects/ContextNodeOrderByWithAggregationInput.schema';
import { ContextNodeScalarWhereWithAggregatesInputObjectSchema } from './objects/ContextNodeScalarWhereWithAggregatesInput.schema';
import { ContextNodeScalarFieldEnumSchema } from './enums/ContextNodeScalarFieldEnum.schema';

export const ContextNodeGroupBySchema = z.object({
	where: ContextNodeWhereInputObjectSchema.optional(),
	orderBy: z.union([
		ContextNodeOrderByWithAggregationInputObjectSchema,
		ContextNodeOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: ContextNodeScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(ContextNodeScalarFieldEnumSchema),
});
