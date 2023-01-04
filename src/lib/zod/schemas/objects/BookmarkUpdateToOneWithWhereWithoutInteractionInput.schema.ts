import { z } from 'zod';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { BookmarkUpdateWithoutInteractionInputObjectSchema } from './BookmarkUpdateWithoutInteractionInput.schema';
import { BookmarkUncheckedUpdateWithoutInteractionInputObjectSchema } from './BookmarkUncheckedUpdateWithoutInteractionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateToOneWithWhereWithoutInteractionInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => BookmarkUpdateWithoutInteractionInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutInteractionInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpdateToOneWithWhereWithoutInteractionInputObjectSchema = Schema;
