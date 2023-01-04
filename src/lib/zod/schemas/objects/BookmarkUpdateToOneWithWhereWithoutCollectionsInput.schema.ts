import { z } from 'zod';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { BookmarkUpdateWithoutCollectionsInputObjectSchema } from './BookmarkUpdateWithoutCollectionsInput.schema';
import { BookmarkUncheckedUpdateWithoutCollectionsInputObjectSchema } from './BookmarkUncheckedUpdateWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateToOneWithWhereWithoutCollectionsInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => BookmarkUpdateWithoutCollectionsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutCollectionsInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpdateToOneWithWhereWithoutCollectionsInputObjectSchema = Schema;
