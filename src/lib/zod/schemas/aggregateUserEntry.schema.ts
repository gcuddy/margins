import { z } from 'zod';
import { UserEntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/UserEntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { UserEntryWhereInputObjectSchema } from './objects/UserEntryWhereInput.schema';
import { UserEntryWhereUniqueInputObjectSchema } from './objects/UserEntryWhereUniqueInput.schema';
import { UserEntryCountAggregateInputObjectSchema } from './objects/UserEntryCountAggregateInput.schema';
import { UserEntryMinAggregateInputObjectSchema } from './objects/UserEntryMinAggregateInput.schema';
import { UserEntryMaxAggregateInputObjectSchema } from './objects/UserEntryMaxAggregateInput.schema';
import { UserEntryAvgAggregateInputObjectSchema } from './objects/UserEntryAvgAggregateInput.schema';
import { UserEntrySumAggregateInputObjectSchema } from './objects/UserEntrySumAggregateInput.schema';

export const UserEntryAggregateSchema = z.object({
	orderBy: z
		.union([
			UserEntryOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			UserEntryOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: UserEntryWhereInputObjectSchema.optional(),
	cursor: UserEntryWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), UserEntryCountAggregateInputObjectSchema]).optional(),
	_min: UserEntryMinAggregateInputObjectSchema.optional(),
	_max: UserEntryMaxAggregateInputObjectSchema.optional(),
	_avg: UserEntryAvgAggregateInputObjectSchema.optional(),
	_sum: UserEntrySumAggregateInputObjectSchema.optional(),
});
