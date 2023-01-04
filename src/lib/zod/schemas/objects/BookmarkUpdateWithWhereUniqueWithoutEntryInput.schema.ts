import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateWithoutEntryInputObjectSchema } from './BookmarkUpdateWithoutEntryInput.schema';
import { BookmarkUncheckedUpdateWithoutEntryInputObjectSchema } from './BookmarkUncheckedUpdateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => BookmarkUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpdateWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
