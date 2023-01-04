import { z } from 'zod';
import { BookmarkWhereInputObjectSchema } from './objects/BookmarkWhereInput.schema';

export const BookmarkDeleteManySchema = z.object({
	where: BookmarkWhereInputObjectSchema.optional(),
});
