import { z } from 'zod';
import { BookmarkUpdateInputObjectSchema } from './objects/BookmarkUpdateInput.schema';
import { BookmarkUncheckedUpdateInputObjectSchema } from './objects/BookmarkUncheckedUpdateInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './objects/BookmarkWhereUniqueInput.schema';

export const BookmarkUpdateOneSchema = z.object({
	data: z.union([BookmarkUpdateInputObjectSchema, BookmarkUncheckedUpdateInputObjectSchema]),
	where: BookmarkWhereUniqueInputObjectSchema,
});
