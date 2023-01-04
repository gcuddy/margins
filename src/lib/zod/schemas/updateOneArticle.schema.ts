import { z } from 'zod';
import { ArticleUpdateInputObjectSchema } from './objects/ArticleUpdateInput.schema';
import { ArticleUncheckedUpdateInputObjectSchema } from './objects/ArticleUncheckedUpdateInput.schema';
import { ArticleWhereUniqueInputObjectSchema } from './objects/ArticleWhereUniqueInput.schema';

export const ArticleUpdateOneSchema = z.object({
	data: z.union([ArticleUpdateInputObjectSchema, ArticleUncheckedUpdateInputObjectSchema]),
	where: ArticleWhereUniqueInputObjectSchema,
});
