import { z } from 'zod';
import { BookmarkUpdateWithoutAnnotationsInputObjectSchema } from './BookmarkUpdateWithoutAnnotationsInput.schema';
import { BookmarkUncheckedUpdateWithoutAnnotationsInputObjectSchema } from './BookmarkUncheckedUpdateWithoutAnnotationsInput.schema';
import { BookmarkCreateWithoutAnnotationsInputObjectSchema } from './BookmarkCreateWithoutAnnotationsInput.schema';
import { BookmarkUncheckedCreateWithoutAnnotationsInputObjectSchema } from './BookmarkUncheckedCreateWithoutAnnotationsInput.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpsertWithoutAnnotationsInput> = z
	.object({
		update: z.union([
			z.lazy(() => BookmarkUpdateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutAnnotationsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutAnnotationsInputObjectSchema),
		]),
		where: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkUpsertWithoutAnnotationsInputObjectSchema = Schema;
