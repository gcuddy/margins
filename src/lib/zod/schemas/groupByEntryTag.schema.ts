import { z } from 'zod';
import { EntryTagWhereInputObjectSchema } from './objects/EntryTagWhereInput.schema';
import { EntryTagOrderByWithAggregationInputObjectSchema } from './objects/EntryTagOrderByWithAggregationInput.schema';
import { EntryTagScalarWhereWithAggregatesInputObjectSchema } from './objects/EntryTagScalarWhereWithAggregatesInput.schema';
import { EntryTagScalarFieldEnumSchema } from './enums/EntryTagScalarFieldEnum.schema';

export const EntryTagGroupBySchema = z.object({
	where: EntryTagWhereInputObjectSchema.optional(),
	orderBy: z.union([
		EntryTagOrderByWithAggregationInputObjectSchema,
		EntryTagOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: EntryTagScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(EntryTagScalarFieldEnumSchema),
});
