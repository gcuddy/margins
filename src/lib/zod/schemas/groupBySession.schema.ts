import { z } from 'zod';
import { SessionWhereInputObjectSchema } from './objects/SessionWhereInput.schema';
import { SessionOrderByWithAggregationInputObjectSchema } from './objects/SessionOrderByWithAggregationInput.schema';
import { SessionScalarWhereWithAggregatesInputObjectSchema } from './objects/SessionScalarWhereWithAggregatesInput.schema';
import { SessionScalarFieldEnumSchema } from './enums/SessionScalarFieldEnum.schema';

export const SessionGroupBySchema = z.object({
	where: SessionWhereInputObjectSchema.optional(),
	orderBy: z.union([
		SessionOrderByWithAggregationInputObjectSchema,
		SessionOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: SessionScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(SessionScalarFieldEnumSchema),
});
