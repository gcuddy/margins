import { z } from 'zod';
import { InteractionWhereInputObjectSchema } from './objects/InteractionWhereInput.schema';
import { InteractionOrderByWithAggregationInputObjectSchema } from './objects/InteractionOrderByWithAggregationInput.schema';
import { InteractionScalarWhereWithAggregatesInputObjectSchema } from './objects/InteractionScalarWhereWithAggregatesInput.schema';
import { InteractionScalarFieldEnumSchema } from './enums/InteractionScalarFieldEnum.schema';

export const InteractionGroupBySchema = z.object({
	where: InteractionWhereInputObjectSchema.optional(),
	orderBy: z.union([
		InteractionOrderByWithAggregationInputObjectSchema,
		InteractionOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: InteractionScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(InteractionScalarFieldEnumSchema),
});
