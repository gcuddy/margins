import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateWithoutEntryInputObjectSchema } from './BookmarkUpdateWithoutEntryInput.schema';
import { BookmarkUncheckedUpdateWithoutEntryInputObjectSchema } from './BookmarkUncheckedUpdateWithoutEntryInput.schema';
import { BookmarkCreateWithoutEntryInputObjectSchema } from './BookmarkCreateWithoutEntryInput.schema';
import { BookmarkUncheckedCreateWithoutEntryInputObjectSchema } from './BookmarkUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpsertWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => BookmarkUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutEntryInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpsertWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
