import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkCreateWithoutTagsInputObjectSchema } from './BookmarkCreateWithoutTagsInput.schema';
import { BookmarkUncheckedCreateWithoutTagsInputObjectSchema } from './BookmarkUncheckedCreateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutTagsInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutTagsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkCreateOrConnectWithoutTagsInputObjectSchema = Schema;
