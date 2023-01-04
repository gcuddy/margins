import { z } from 'zod';
import { BookmarkCreateInputObjectSchema } from './objects/BookmarkCreateInput.schema';
import { BookmarkUncheckedCreateInputObjectSchema } from './objects/BookmarkUncheckedCreateInput.schema';

export const BookmarkCreateOneSchema = z.object({
	data: z.union([BookmarkCreateInputObjectSchema, BookmarkUncheckedCreateInputObjectSchema]),
});
