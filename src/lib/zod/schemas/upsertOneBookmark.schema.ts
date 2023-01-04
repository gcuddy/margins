import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './objects/BookmarkWhereUniqueInput.schema';
import { BookmarkCreateInputObjectSchema } from './objects/BookmarkCreateInput.schema';
import { BookmarkUncheckedCreateInputObjectSchema } from './objects/BookmarkUncheckedCreateInput.schema';
import { BookmarkUpdateInputObjectSchema } from './objects/BookmarkUpdateInput.schema';
import { BookmarkUncheckedUpdateInputObjectSchema } from './objects/BookmarkUncheckedUpdateInput.schema';

export const BookmarkUpsertSchema = z.object({
	where: BookmarkWhereUniqueInputObjectSchema,
	create: z.union([BookmarkCreateInputObjectSchema, BookmarkUncheckedCreateInputObjectSchema]),
	update: z.union([BookmarkUpdateInputObjectSchema, BookmarkUncheckedUpdateInputObjectSchema]),
});
