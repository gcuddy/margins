import { z } from 'zod';
import { EntryMediaWhereInputObjectSchema } from './objects/EntryMediaWhereInput.schema';
import { EntryMediaOrderByWithAggregationInputObjectSchema } from './objects/EntryMediaOrderByWithAggregationInput.schema';
import { EntryMediaScalarWhereWithAggregatesInputObjectSchema } from './objects/EntryMediaScalarWhereWithAggregatesInput.schema';
import { EntryMediaScalarFieldEnumSchema } from './enums/EntryMediaScalarFieldEnum.schema';

export const EntryMediaGroupBySchema = z.object({
	where: EntryMediaWhereInputObjectSchema.optional(),
	orderBy: z.union([
		EntryMediaOrderByWithAggregationInputObjectSchema,
		EntryMediaOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: EntryMediaScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(EntryMediaScalarFieldEnumSchema),
});
