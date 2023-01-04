import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateWithoutStateInputObjectSchema } from './BookmarkUpdateWithoutStateInput.schema';
import { BookmarkUncheckedUpdateWithoutStateInputObjectSchema } from './BookmarkUncheckedUpdateWithoutStateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateWithWhereUniqueWithoutStateInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => BookmarkUpdateWithoutStateInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutStateInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpdateWithWhereUniqueWithoutStateInputObjectSchema = Schema;
