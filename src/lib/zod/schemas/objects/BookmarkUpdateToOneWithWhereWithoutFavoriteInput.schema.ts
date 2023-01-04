import { z } from 'zod';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { BookmarkUpdateWithoutFavoriteInputObjectSchema } from './BookmarkUpdateWithoutFavoriteInput.schema';
import { BookmarkUncheckedUpdateWithoutFavoriteInputObjectSchema } from './BookmarkUncheckedUpdateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateToOneWithWhereWithoutFavoriteInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => BookmarkUpdateWithoutFavoriteInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutFavoriteInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpdateToOneWithWhereWithoutFavoriteInputObjectSchema = Schema;
