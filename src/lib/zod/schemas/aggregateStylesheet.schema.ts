import { z } from 'zod';
import { StylesheetOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/StylesheetOrderByWithRelationAndSearchRelevanceInput.schema';
import { StylesheetWhereInputObjectSchema } from './objects/StylesheetWhereInput.schema';
import { StylesheetWhereUniqueInputObjectSchema } from './objects/StylesheetWhereUniqueInput.schema';
import { StylesheetCountAggregateInputObjectSchema } from './objects/StylesheetCountAggregateInput.schema';
import { StylesheetMinAggregateInputObjectSchema } from './objects/StylesheetMinAggregateInput.schema';
import { StylesheetMaxAggregateInputObjectSchema } from './objects/StylesheetMaxAggregateInput.schema';
import { StylesheetAvgAggregateInputObjectSchema } from './objects/StylesheetAvgAggregateInput.schema';
import { StylesheetSumAggregateInputObjectSchema } from './objects/StylesheetSumAggregateInput.schema';

export const StylesheetAggregateSchema = z.object({
	orderBy: z
		.union([
			StylesheetOrderByWithRelationAndSearchRelevanceInputObjectSchema,
			StylesheetOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
		])
		.optional(),
	where: StylesheetWhereInputObjectSchema.optional(),
	cursor: StylesheetWhereUniqueInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	_count: z.union([z.literal(true), StylesheetCountAggregateInputObjectSchema]).optional(),
	_min: StylesheetMinAggregateInputObjectSchema.optional(),
	_max: StylesheetMaxAggregateInputObjectSchema.optional(),
	_avg: StylesheetAvgAggregateInputObjectSchema.optional(),
	_sum: StylesheetSumAggregateInputObjectSchema.optional(),
});
