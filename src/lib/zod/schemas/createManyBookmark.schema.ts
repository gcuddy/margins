import { z } from 'zod';
import { BookmarkCreateManyInputObjectSchema } from './objects/BookmarkCreateManyInput.schema';

export const BookmarkCreateManySchema = z.object({ data: BookmarkCreateManyInputObjectSchema });
