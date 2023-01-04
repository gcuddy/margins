import { z } from 'zod';
import { BookmarkUpdateWithoutCollectionsInputObjectSchema } from './BookmarkUpdateWithoutCollectionsInput.schema';
import { BookmarkUncheckedUpdateWithoutCollectionsInputObjectSchema } from './BookmarkUncheckedUpdateWithoutCollectionsInput.schema';
import { BookmarkCreateWithoutCollectionsInputObjectSchema } from './BookmarkCreateWithoutCollectionsInput.schema';
import { BookmarkUncheckedCreateWithoutCollectionsInputObjectSchema } from './BookmarkUncheckedCreateWithoutCollectionsInput.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpsertWithoutCollectionsInput> = z
	.object({
		update: z.union([
			z.lazy(() => BookmarkUpdateWithoutCollectionsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutCollectionsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutCollectionsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutCollectionsInputObjectSchema),
		]),
		where: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkUpsertWithoutCollectionsInputObjectSchema = Schema;
