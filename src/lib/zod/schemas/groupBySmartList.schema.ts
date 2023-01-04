import { z } from 'zod';
import { SmartListWhereInputObjectSchema } from './objects/SmartListWhereInput.schema';
import { SmartListOrderByWithAggregationInputObjectSchema } from './objects/SmartListOrderByWithAggregationInput.schema';
import { SmartListScalarWhereWithAggregatesInputObjectSchema } from './objects/SmartListScalarWhereWithAggregatesInput.schema';
import { SmartListScalarFieldEnumSchema } from './enums/SmartListScalarFieldEnum.schema';

export const SmartListGroupBySchema = z.object({
	where: SmartListWhereInputObjectSchema.optional(),
	orderBy: z.union([
		SmartListOrderByWithAggregationInputObjectSchema,
		SmartListOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: SmartListScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(SmartListScalarFieldEnumSchema),
});
