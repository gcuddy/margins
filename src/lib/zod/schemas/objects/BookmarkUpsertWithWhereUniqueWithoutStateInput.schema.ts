import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateWithoutStateInputObjectSchema } from './BookmarkUpdateWithoutStateInput.schema';
import { BookmarkUncheckedUpdateWithoutStateInputObjectSchema } from './BookmarkUncheckedUpdateWithoutStateInput.schema';
import { BookmarkCreateWithoutStateInputObjectSchema } from './BookmarkCreateWithoutStateInput.schema';
import { BookmarkUncheckedCreateWithoutStateInputObjectSchema } from './BookmarkUncheckedCreateWithoutStateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpsertWithWhereUniqueWithoutStateInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => BookmarkUpdateWithoutStateInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutStateInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutStateInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutStateInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpsertWithWhereUniqueWithoutStateInputObjectSchema = Schema;
