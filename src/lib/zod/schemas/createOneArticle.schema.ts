import { z } from 'zod';
import { ArticleCreateInputObjectSchema } from './objects/ArticleCreateInput.schema';
import { ArticleUncheckedCreateInputObjectSchema } from './objects/ArticleUncheckedCreateInput.schema';

export const ArticleCreateOneSchema = z.object({
	data: z.union([ArticleCreateInputObjectSchema, ArticleUncheckedCreateInputObjectSchema]),
});
