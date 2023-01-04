import { z } from 'zod';
import { UserEntryWhereInputObjectSchema } from './objects/UserEntryWhereInput.schema';
import { UserEntryOrderByWithAggregationInputObjectSchema } from './objects/UserEntryOrderByWithAggregationInput.schema';
import { UserEntryScalarWhereWithAggregatesInputObjectSchema } from './objects/UserEntryScalarWhereWithAggregatesInput.schema';
import { UserEntryScalarFieldEnumSchema } from './enums/UserEntryScalarFieldEnum.schema';

export const UserEntryGroupBySchema = z.object({
	where: UserEntryWhereInputObjectSchema.optional(),
	orderBy: z.union([
		UserEntryOrderByWithAggregationInputObjectSchema,
		UserEntryOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: UserEntryScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(UserEntryScalarFieldEnumSchema),
});
