import { z } from 'zod';
import { ArticleCreateManyInputObjectSchema } from './objects/ArticleCreateManyInput.schema';

export const ArticleCreateManySchema = z.object({ data: ArticleCreateManyInputObjectSchema });
