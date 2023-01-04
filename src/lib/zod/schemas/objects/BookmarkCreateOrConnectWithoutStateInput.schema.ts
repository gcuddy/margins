import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkCreateWithoutStateInputObjectSchema } from './BookmarkCreateWithoutStateInput.schema';
import { BookmarkUncheckedCreateWithoutStateInputObjectSchema } from './BookmarkUncheckedCreateWithoutStateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutStateInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutStateInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutStateInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkCreateOrConnectWithoutStateInputObjectSchema = Schema;
