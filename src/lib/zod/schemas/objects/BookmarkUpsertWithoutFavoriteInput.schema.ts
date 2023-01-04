import { z } from 'zod';
import { BookmarkUpdateWithoutFavoriteInputObjectSchema } from './BookmarkUpdateWithoutFavoriteInput.schema';
import { BookmarkUncheckedUpdateWithoutFavoriteInputObjectSchema } from './BookmarkUncheckedUpdateWithoutFavoriteInput.schema';
import { BookmarkCreateWithoutFavoriteInputObjectSchema } from './BookmarkCreateWithoutFavoriteInput.schema';
import { BookmarkUncheckedCreateWithoutFavoriteInputObjectSchema } from './BookmarkUncheckedCreateWithoutFavoriteInput.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpsertWithoutFavoriteInput> = z
	.object({
		update: z.union([
			z.lazy(() => BookmarkUpdateWithoutFavoriteInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutFavoriteInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutFavoriteInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutFavoriteInputObjectSchema),
		]),
		where: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkUpsertWithoutFavoriteInputObjectSchema = Schema;
