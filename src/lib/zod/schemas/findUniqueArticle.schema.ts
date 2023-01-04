import { z } from 'zod';
import { ArticleWhereUniqueInputObjectSchema } from './objects/ArticleWhereUniqueInput.schema';

export const ArticleFindUniqueSchema = z.object({ where: ArticleWhereUniqueInputObjectSchema });
