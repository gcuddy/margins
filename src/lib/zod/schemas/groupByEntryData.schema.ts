import { z } from 'zod';
import { EntryDataWhereInputObjectSchema } from './objects/EntryDataWhereInput.schema';
import { EntryDataOrderByWithAggregationInputObjectSchema } from './objects/EntryDataOrderByWithAggregationInput.schema';
import { EntryDataScalarWhereWithAggregatesInputObjectSchema } from './objects/EntryDataScalarWhereWithAggregatesInput.schema';
import { EntryDataScalarFieldEnumSchema } from './enums/EntryDataScalarFieldEnum.schema';

export const EntryDataGroupBySchema = z.object({
	where: EntryDataWhereInputObjectSchema.optional(),
	orderBy: z.union([
		EntryDataOrderByWithAggregationInputObjectSchema,
		EntryDataOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: EntryDataScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(EntryDataScalarFieldEnumSchema),
});
