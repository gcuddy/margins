import { z } from 'zod';
import { BookmarkUpdateManyMutationInputObjectSchema } from './objects/BookmarkUpdateManyMutationInput.schema';
import { BookmarkWhereInputObjectSchema } from './objects/BookmarkWhereInput.schema';

export const BookmarkUpdateManySchema = z.object({
	data: BookmarkUpdateManyMutationInputObjectSchema,
	where: BookmarkWhereInputObjectSchema.optional(),
});
