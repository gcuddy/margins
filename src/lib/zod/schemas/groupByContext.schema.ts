import { z } from 'zod';
import { ContextWhereInputObjectSchema } from './objects/ContextWhereInput.schema';
import { ContextOrderByWithAggregationInputObjectSchema } from './objects/ContextOrderByWithAggregationInput.schema';
import { ContextScalarWhereWithAggregatesInputObjectSchema } from './objects/ContextScalarWhereWithAggregatesInput.schema';
import { ContextScalarFieldEnumSchema } from './enums/ContextScalarFieldEnum.schema';

export const ContextGroupBySchema = z.object({
	where: ContextWhereInputObjectSchema.optional(),
	orderBy: z.union([
		ContextOrderByWithAggregationInputObjectSchema,
		ContextOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: ContextScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(ContextScalarFieldEnumSchema),
});
