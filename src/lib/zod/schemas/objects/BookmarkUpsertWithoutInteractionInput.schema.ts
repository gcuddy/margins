import { z } from 'zod';
import { BookmarkUpdateWithoutInteractionInputObjectSchema } from './BookmarkUpdateWithoutInteractionInput.schema';
import { BookmarkUncheckedUpdateWithoutInteractionInputObjectSchema } from './BookmarkUncheckedUpdateWithoutInteractionInput.schema';
import { BookmarkCreateWithoutInteractionInputObjectSchema } from './BookmarkCreateWithoutInteractionInput.schema';
import { BookmarkUncheckedCreateWithoutInteractionInputObjectSchema } from './BookmarkUncheckedCreateWithoutInteractionInput.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpsertWithoutInteractionInput> = z
	.object({
		update: z.union([
			z.lazy(() => BookmarkUpdateWithoutInteractionInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutInteractionInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutInteractionInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutInteractionInputObjectSchema),
		]),
		where: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkUpsertWithoutInteractionInputObjectSchema = Schema;
