import { z } from 'zod';
import { ArticleWhereUniqueInputObjectSchema } from './objects/ArticleWhereUniqueInput.schema';

export const ArticleDeleteOneSchema = z.object({ where: ArticleWhereUniqueInputObjectSchema });
