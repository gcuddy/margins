import { z } from 'zod';
import { ArticleWhereInputObjectSchema } from './objects/ArticleWhereInput.schema';

export const ArticleDeleteManySchema = z.object({
	where: ArticleWhereInputObjectSchema.optional(),
});
