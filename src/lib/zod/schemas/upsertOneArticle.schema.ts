import { z } from 'zod';
import { ArticleWhereUniqueInputObjectSchema } from './objects/ArticleWhereUniqueInput.schema';
import { ArticleCreateInputObjectSchema } from './objects/ArticleCreateInput.schema';
import { ArticleUncheckedCreateInputObjectSchema } from './objects/ArticleUncheckedCreateInput.schema';
import { ArticleUpdateInputObjectSchema } from './objects/ArticleUpdateInput.schema';
import { ArticleUncheckedUpdateInputObjectSchema } from './objects/ArticleUncheckedUpdateInput.schema';

export const ArticleUpsertSchema = z.object({
	where: ArticleWhereUniqueInputObjectSchema,
	create: z.union([ArticleCreateInputObjectSchema, ArticleUncheckedCreateInputObjectSchema]),
	update: z.union([ArticleUpdateInputObjectSchema, ArticleUncheckedUpdateInputObjectSchema]),
});
