import { z } from 'zod';
import { ArticleUpdateManyMutationInputObjectSchema } from './objects/ArticleUpdateManyMutationInput.schema';
import { ArticleWhereInputObjectSchema } from './objects/ArticleWhereInput.schema';

export const ArticleUpdateManySchema = z.object({
	data: ArticleUpdateManyMutationInputObjectSchema,
	where: ArticleWhereInputObjectSchema.optional(),
});
