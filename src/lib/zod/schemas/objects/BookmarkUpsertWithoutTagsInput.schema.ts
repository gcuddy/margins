import { z } from 'zod';
import { BookmarkUpdateWithoutTagsInputObjectSchema } from './BookmarkUpdateWithoutTagsInput.schema';
import { BookmarkUncheckedUpdateWithoutTagsInputObjectSchema } from './BookmarkUncheckedUpdateWithoutTagsInput.schema';
import { BookmarkCreateWithoutTagsInputObjectSchema } from './BookmarkCreateWithoutTagsInput.schema';
import { BookmarkUncheckedCreateWithoutTagsInputObjectSchema } from './BookmarkUncheckedCreateWithoutTagsInput.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpsertWithoutTagsInput> = z
	.object({
		update: z.union([
			z.lazy(() => BookmarkUpdateWithoutTagsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutTagsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutTagsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputObjectSchema),
		]),
		where: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkUpsertWithoutTagsInputObjectSchema = Schema;
