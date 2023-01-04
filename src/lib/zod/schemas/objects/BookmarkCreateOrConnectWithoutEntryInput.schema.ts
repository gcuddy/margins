import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkCreateWithoutEntryInputObjectSchema } from './BookmarkCreateWithoutEntryInput.schema';
import { BookmarkUncheckedCreateWithoutEntryInputObjectSchema } from './BookmarkUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutEntryInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutEntryInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkCreateOrConnectWithoutEntryInputObjectSchema = Schema;
