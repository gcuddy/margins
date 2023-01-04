import { z } from 'zod';
import { EntryDataOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/EntryDataOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryDataWhereInputObjectSchema } from './objects/EntryDataWhereInput.schema';
import { EntryDataWhereUniqueInputObjectSchema } from './objects/EntryDataWhereUniqueInput.schema';
import { EntryDataCountAggregateInputObjectSchema } from './objects/EntryDataCountAggregateInput.schema';
import { EntryDataMinAggregateInputObjectSchema } from './objects/EntryDataMinAggregateInput.schema';
import { EntryDataMaxAggregateInputObjectSchema } from './objects/EntryDataMaxAggregateInput.schema';
import { EntryDataAvgAggregateInputObjectSchema } from './objects/EntryDataAvgAggregateInput.schema';
import { EntryDataSumAggregateInputObjectSchema } from './objects/EntryDataSumAggregateInput.schema';

export const EntryDataAggregateSchema = z.object({
	orderBy: z
		.union([
			EntryDataOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			EntryDataOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: EntryDataWhereInputObjectSchema.optional(),
	cursor: EntryDataWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), EntryDataCountAggregateInputObjectSchema]).optional(),
	_min: EntryDataMinAggregateInputObjectSchema.optional(),
	_max: EntryDataMaxAggregateInputObjectSchema.optional(),
	_avg: EntryDataAvgAggregateInputObjectSchema.optional(),
	_sum: EntryDataSumAggregateInputObjectSchema.optional(),
});
