import { z } from 'zod';
import { ArticleOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/ArticleOrderByWithRelationAndSearchRelevanceInput.schema';
import { ArticleWhereInputObjectSchema } from './objects/ArticleWhereInput.schema';
import { ArticleWhereUniqueInputObjectSchema } from './objects/ArticleWhereUniqueInput.schema';
import { ArticleCountAggregateInputObjectSchema } from './objects/ArticleCountAggregateInput.schema';
import { ArticleMinAggregateInputObjectSchema } from './objects/ArticleMinAggregateInput.schema';
import { ArticleMaxAggregateInputObjectSchema } from './objects/ArticleMaxAggregateInput.schema';
import { ArticleAvgAggregateInputObjectSchema } from './objects/ArticleAvgAggregateInput.schema';
import { ArticleSumAggregateInputObjectSchema } from './objects/ArticleSumAggregateInput.schema';

export const ArticleAggregateSchema = z.object({
	orderBy: z
		.union([
			ArticleOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			ArticleOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: ArticleWhereInputObjectSchema.optional(),
	cursor: ArticleWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), ArticleCountAggregateInputObjectSchema]).optional(),
	_min: ArticleMinAggregateInputObjectSchema.optional(),
	_max: ArticleMaxAggregateInputObjectSchema.optional(),
	_avg: ArticleAvgAggregateInputObjectSchema.optional(),
	_sum: ArticleSumAggregateInputObjectSchema.optional(),
});
