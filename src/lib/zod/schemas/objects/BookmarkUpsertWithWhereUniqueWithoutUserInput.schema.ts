import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateWithoutUserInputObjectSchema } from './BookmarkUpdateWithoutUserInput.schema';
import { BookmarkUncheckedUpdateWithoutUserInputObjectSchema } from './BookmarkUncheckedUpdateWithoutUserInput.schema';
import { BookmarkCreateWithoutUserInputObjectSchema } from './BookmarkCreateWithoutUserInput.schema';
import { BookmarkUncheckedCreateWithoutUserInputObjectSchema } from './BookmarkUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => BookmarkUpdateWithoutUserInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutUserInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
