import { z } from 'zod';
import { BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/BookmarkOrderByWithRelationAndSearchRelevanceInput.schema';
import { BookmarkWhereInputObjectSchema } from './objects/BookmarkWhereInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './objects/BookmarkWhereUniqueInput.schema';
import { BookmarkCountAggregateInputObjectSchema } from './objects/BookmarkCountAggregateInput.schema';
import { BookmarkMinAggregateInputObjectSchema } from './objects/BookmarkMinAggregateInput.schema';
import { BookmarkMaxAggregateInputObjectSchema } from './objects/BookmarkMaxAggregateInput.schema';
import { BookmarkAvgAggregateInputObjectSchema } from './objects/BookmarkAvgAggregateInput.schema';
import { BookmarkSumAggregateInputObjectSchema } from './objects/BookmarkSumAggregateInput.schema';

export const BookmarkAggregateSchema = z.object({
	orderBy: z
		.union([
			BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			BookmarkOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: BookmarkWhereInputObjectSchema.optional(),
	cursor: BookmarkWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), BookmarkCountAggregateInputObjectSchema]).optional(),
	_min: BookmarkMinAggregateInputObjectSchema.optional(),
	_max: BookmarkMaxAggregateInputObjectSchema.optional(),
	_avg: BookmarkAvgAggregateInputObjectSchema.optional(),
	_sum: BookmarkSumAggregateInputObjectSchema.optional(),
});
