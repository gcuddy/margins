import { z } from 'zod';
import { StateWhereInputObjectSchema } from './objects/StateWhereInput.schema';
import { StateOrderByWithAggregationInputObjectSchema } from './objects/StateOrderByWithAggregationInput.schema';
import { StateScalarWhereWithAggregatesInputObjectSchema } from './objects/StateScalarWhereWithAggregatesInput.schema';
import { StateScalarFieldEnumSchema } from './enums/StateScalarFieldEnum.schema';

export const StateGroupBySchema = z.object({
	where: StateWhereInputObjectSchema.optional(),
	orderBy: z.union([
		StateOrderByWithAggregationInputObjectSchema,
		StateOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: StateScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(StateScalarFieldEnumSchema),
});
