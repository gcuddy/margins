import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './objects/EntryWhereInput.schema';
import { EntryOrderByWithAggregationInputObjectSchema } from './objects/EntryOrderByWithAggregationInput.schema';
import { EntryScalarWhereWithAggregatesInputObjectSchema } from './objects/EntryScalarWhereWithAggregatesInput.schema';
import { EntryScalarFieldEnumSchema } from './enums/EntryScalarFieldEnum.schema';

export const EntryGroupBySchema = z.object({
	where: EntryWhereInputObjectSchema.optional(),
	orderBy: z.union([
		EntryOrderByWithAggregationInputObjectSchema,
		EntryOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: EntryScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(EntryScalarFieldEnumSchema),
});
