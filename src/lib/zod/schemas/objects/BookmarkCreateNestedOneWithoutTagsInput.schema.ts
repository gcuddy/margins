import { z } from 'zod';
import { BookmarkCreateWithoutTagsInputObjectSchema } from './BookmarkCreateWithoutTagsInput.schema';
import { BookmarkUncheckedCreateWithoutTagsInputObjectSchema } from './BookmarkUncheckedCreateWithoutTagsInput.schema';
import { BookmarkCreateOrConnectWithoutTagsInputObjectSchema } from './BookmarkCreateOrConnectWithoutTagsInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateNestedOneWithoutTagsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => BookmarkCreateWithoutTagsInputObjectSchema),
				z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => BookmarkCreateOrConnectWithoutTagsInputObjectSchema).optional(),
		connect: z.lazy(() => BookmarkWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkCreateNestedOneWithoutTagsInputObjectSchema = Schema;
