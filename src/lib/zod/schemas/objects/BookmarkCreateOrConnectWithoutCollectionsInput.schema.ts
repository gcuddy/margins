import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkCreateWithoutCollectionsInputObjectSchema } from './BookmarkCreateWithoutCollectionsInput.schema';
import { BookmarkUncheckedCreateWithoutCollectionsInputObjectSchema } from './BookmarkUncheckedCreateWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutCollectionsInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutCollectionsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutCollectionsInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkCreateOrConnectWithoutCollectionsInputObjectSchema = Schema;
