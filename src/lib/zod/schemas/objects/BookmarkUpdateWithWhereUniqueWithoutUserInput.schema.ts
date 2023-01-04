import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateWithoutUserInputObjectSchema } from './BookmarkUpdateWithoutUserInput.schema';
import { BookmarkUncheckedUpdateWithoutUserInputObjectSchema } from './BookmarkUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => BookmarkUpdateWithoutUserInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
