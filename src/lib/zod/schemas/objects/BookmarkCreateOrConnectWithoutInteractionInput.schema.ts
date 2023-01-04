import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkCreateWithoutInteractionInputObjectSchema } from './BookmarkCreateWithoutInteractionInput.schema';
import { BookmarkUncheckedCreateWithoutInteractionInputObjectSchema } from './BookmarkUncheckedCreateWithoutInteractionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutInteractionInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutInteractionInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutInteractionInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkCreateOrConnectWithoutInteractionInputObjectSchema = Schema;
