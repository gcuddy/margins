import { z } from 'zod';
import { ArticleWhereInputObjectSchema } from './objects/ArticleWhereInput.schema';
import { ArticleOrderByWithAggregationInputObjectSchema } from './objects/ArticleOrderByWithAggregationInput.schema';
import { ArticleScalarWhereWithAggregatesInputObjectSchema } from './objects/ArticleScalarWhereWithAggregatesInput.schema';
import { ArticleScalarFieldEnumSchema } from './enums/ArticleScalarFieldEnum.schema';

export const ArticleGroupBySchema = z.object({
	where: ArticleWhereInputObjectSchema.optional(),
	orderBy: z.union([
		ArticleOrderByWithAggregationInputObjectSchema,
		ArticleOrderByWithAggregationInputObjectSchema.array(),
	]),
	having: ArticleScalarWhereWithAggregatesInputObjectSchema.optional(),
	take: z.number().optional(),
	skip: z.number().optional(),
	by: z.array(ArticleScalarFieldEnumSchema),
});
