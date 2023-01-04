import { z } from 'zod';
import { EntryTagOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/EntryTagOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryTagWhereInputObjectSchema } from './objects/EntryTagWhereInput.schema';
import { EntryTagWhereUniqueInputObjectSchema } from './objects/EntryTagWhereUniqueInput.schema';
import { EntryTagCountAggregateInputObjectSchema } from './objects/EntryTagCountAggregateInput.schema';
import { EntryTagMinAggregateInputObjectSchema } from './objects/EntryTagMinAggregateInput.schema';
import { EntryTagMaxAggregateInputObjectSchema } from './objects/EntryTagMaxAggregateInput.schema';
import { EntryTagAvgAggregateInputObjectSchema } from './objects/EntryTagAvgAggregateInput.schema';
import { EntryTagSumAggregateInputObjectSchema } from './objects/EntryTagSumAggregateInput.schema';

export const EntryTagAggregateSchema = z.object({
	orderBy: z
		.union([
			EntryTagOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			EntryTagOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: EntryTagWhereInputObjectSchema.optional(),
	cursor: EntryTagWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), EntryTagCountAggregateInputObjectSchema]).optional(),
	_min: EntryTagMinAggregateInputObjectSchema.optional(),
	_max: EntryTagMaxAggregateInputObjectSchema.optional(),
	_avg: EntryTagAvgAggregateInputObjectSchema.optional(),
	_sum: EntryTagSumAggregateInputObjectSchema.optional(),
});
