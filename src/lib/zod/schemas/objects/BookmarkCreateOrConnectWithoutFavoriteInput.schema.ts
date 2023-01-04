import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkCreateWithoutFavoriteInputObjectSchema } from './BookmarkCreateWithoutFavoriteInput.schema';
import { BookmarkUncheckedCreateWithoutFavoriteInputObjectSchema } from './BookmarkUncheckedCreateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutFavoriteInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutFavoriteInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutFavoriteInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkCreateOrConnectWithoutFavoriteInputObjectSchema = Schema;
