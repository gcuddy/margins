import { z } from 'zod';
import { BookmarkCreateWithoutInteractionInputObjectSchema } from './BookmarkCreateWithoutInteractionInput.schema';
import { BookmarkUncheckedCreateWithoutInteractionInputObjectSchema } from './BookmarkUncheckedCreateWithoutInteractionInput.schema';
import { BookmarkCreateOrConnectWithoutInteractionInputObjectSchema } from './BookmarkCreateOrConnectWithoutInteractionInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUncheckedCreateNestedOneWithoutInteractionInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => BookmarkCreateWithoutInteractionInputObjectSchema),
				z.lazy(() => BookmarkUncheckedCreateWithoutInteractionInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => BookmarkCreateOrConnectWithoutInteractionInputObjectSchema)
			.optional(),
		connect: z.lazy(() => BookmarkWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkUncheckedCreateNestedOneWithoutInteractionInputObjectSchema = Schema;
