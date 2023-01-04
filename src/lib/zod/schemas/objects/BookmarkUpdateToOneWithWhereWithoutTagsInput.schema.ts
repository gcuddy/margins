import { z } from 'zod';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { BookmarkUpdateWithoutTagsInputObjectSchema } from './BookmarkUpdateWithoutTagsInput.schema';
import { BookmarkUncheckedUpdateWithoutTagsInputObjectSchema } from './BookmarkUncheckedUpdateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateToOneWithWhereWithoutTagsInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => BookmarkUpdateWithoutTagsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpdateToOneWithWhereWithoutTagsInputObjectSchema = Schema;
