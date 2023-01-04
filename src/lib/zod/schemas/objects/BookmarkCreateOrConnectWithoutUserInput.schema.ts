import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkCreateWithoutUserInputObjectSchema } from './BookmarkCreateWithoutUserInput.schema';
import { BookmarkUncheckedCreateWithoutUserInputObjectSchema } from './BookmarkUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutUserInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkCreateOrConnectWithoutUserInputObjectSchema = Schema;
