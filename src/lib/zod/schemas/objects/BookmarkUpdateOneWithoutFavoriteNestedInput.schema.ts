import { z } from 'zod';
import { BookmarkCreateWithoutFavoriteInputObjectSchema } from './BookmarkCreateWithoutFavoriteInput.schema';
import { BookmarkUncheckedCreateWithoutFavoriteInputObjectSchema } from './BookmarkUncheckedCreateWithoutFavoriteInput.schema';
import { BookmarkCreateOrConnectWithoutFavoriteInputObjectSchema } from './BookmarkCreateOrConnectWithoutFavoriteInput.schema';
import { BookmarkUpsertWithoutFavoriteInputObjectSchema } from './BookmarkUpsertWithoutFavoriteInput.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateToOneWithWhereWithoutFavoriteInputObjectSchema } from './BookmarkUpdateToOneWithWhereWithoutFavoriteInput.schema';
import { BookmarkUpdateWithoutFavoriteInputObjectSchema } from './BookmarkUpdateWithoutFavoriteInput.schema';
import { BookmarkUncheckedUpdateWithoutFavoriteInputObjectSchema } from './BookmarkUncheckedUpdateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateOneWithoutFavoriteNestedInput> = z
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
		upsert: z.lazy(() => BookmarkUpsertWithoutFavoriteInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => BookmarkWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => BookmarkWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => BookmarkWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => BookmarkUpdateToOneWithWhereWithoutFavoriteInputObjectSchema),
				z.lazy(() => BookmarkUpdateWithoutFavoriteInputObjectSchema),
				z.lazy(() => BookmarkUncheckedUpdateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const BookmarkUpdateOneWithoutFavoriteNestedInputObjectSchema = Schema;
