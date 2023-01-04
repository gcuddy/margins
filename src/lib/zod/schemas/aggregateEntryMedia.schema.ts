import { z } from 'zod';
import { EntryMediaOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/EntryMediaOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryMediaWhereInputObjectSchema } from './objects/EntryMediaWhereInput.schema';
import { EntryMediaWhereUniqueInputObjectSchema } from './objects/EntryMediaWhereUniqueInput.schema';
import { EntryMediaCountAggregateInputObjectSchema } from './objects/EntryMediaCountAggregateInput.schema';
import { EntryMediaMinAggregateInputObjectSchema } from './objects/EntryMediaMinAggregateInput.schema';
import { EntryMediaMaxAggregateInputObjectSchema } from './objects/EntryMediaMaxAggregateInput.schema';
import { EntryMediaAvgAggregateInputObjectSchema } from './objects/EntryMediaAvgAggregateInput.schema';
import { EntryMediaSumAggregateInputObjectSchema } from './objects/EntryMediaSumAggregateInput.schema';

export const EntryMediaAggregateSchema = z.object({
	orderBy: z
		.union([
			EntryMediaOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			EntryMediaOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: EntryMediaWhereInputObjectSchema.optional(),
	cursor: EntryMediaWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), EntryMediaCountAggregateInputObjectSchema]).optional(),
	_min: EntryMediaMinAggregateInputObjectSchema.optional(),
	_max: EntryMediaMaxAggregateInputObjectSchema.optional(),
	_avg: EntryMediaAvgAggregateInputObjectSchema.optional(),
	_sum: EntryMediaSumAggregateInputObjectSchema.optional(),
});
