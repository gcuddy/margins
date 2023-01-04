import { z } from 'zod';
import { EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/EntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryWhereInputObjectSchema } from './objects/EntryWhereInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './objects/EntryWhereUniqueInput.schema';
import { EntryCountAggregateInputObjectSchema } from './objects/EntryCountAggregateInput.schema';
import { EntryMinAggregateInputObjectSchema } from './objects/EntryMinAggregateInput.schema';
import { EntryMaxAggregateInputObjectSchema } from './objects/EntryMaxAggregateInput.schema';
import { EntryAvgAggregateInputObjectSchema } from './objects/EntryAvgAggregateInput.schema';
import { EntrySumAggregateInputObjectSchema } from './objects/EntrySumAggregateInput.schema';

export const EntryAggregateSchema = z.object({
	orderBy: z
		.union([
			EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: EntryWhereInputObjectSchema.optional(),
	cursor: EntryWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), EntryCountAggregateInputObjectSchema]).optional(),
	_min: EntryMinAggregateInputObjectSchema.optional(),
	_max: EntryMaxAggregateInputObjectSchema.optional(),
	_avg: EntryAvgAggregateInputObjectSchema.optional(),
	_sum: EntrySumAggregateInputObjectSchema.optional(),
});
