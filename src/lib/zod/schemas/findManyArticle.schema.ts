import { z } from 'zod';
import { ArticleOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/ArticleOrderByWithRelationAndSearchRelevanceInput.schema';
import { ArticleWhereInputObjectSchema } from './objects/ArticleWhereInput.schema';
import { ArticleWhereUniqueInputObjectSchema } from './objects/ArticleWhereUniqueInput.schema';
import { ArticleScalarFieldEnumSchema } from './enums/ArticleScalarFieldEnum.schema';

export const ArticleFindManySchema = z.object({
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
	distinct: z.array(ArticleScalarFieldEnumSchema).optional(),
});
