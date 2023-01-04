import { z } from 'zod';
import { BookmarkCreateWithoutFavoriteInputObjectSchema } from './BookmarkCreateWithoutFavoriteInput.schema';
import { BookmarkUncheckedCreateWithoutFavoriteInputObjectSchema } from './BookmarkUncheckedCreateWithoutFavoriteInput.schema';
import { BookmarkCreateOrConnectWithoutFavoriteInputObjectSchema } from './BookmarkCreateOrConnectWithoutFavoriteInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateNestedOneWithoutFavoriteInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => BookmarkCreateWithoutFavoriteInputObjectSchema),
				z.lazy(() => BookmarkUncheckedCreateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => BookmarkCreateOrConnectWithoutFavoriteInputObjectSchema)
			.optional(),
		connect: z.lazy(() => BookmarkWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkCreateNestedOneWithoutFavoriteInputObjectSchema = Schema;
