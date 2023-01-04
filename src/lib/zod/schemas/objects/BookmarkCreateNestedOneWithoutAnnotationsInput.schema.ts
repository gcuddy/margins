import { z } from 'zod';
import { BookmarkCreateWithoutAnnotationsInputObjectSchema } from './BookmarkCreateWithoutAnnotationsInput.schema';
import { BookmarkUncheckedCreateWithoutAnnotationsInputObjectSchema } from './BookmarkUncheckedCreateWithoutAnnotationsInput.schema';
import { BookmarkCreateOrConnectWithoutAnnotationsInputObjectSchema } from './BookmarkCreateOrConnectWithoutAnnotationsInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateNestedOneWithoutAnnotationsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => BookmarkCreateWithoutAnnotationsInputObjectSchema),
				z.lazy(() => BookmarkUncheckedCreateWithoutAnnotationsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => BookmarkCreateOrConnectWithoutAnnotationsInputObjectSchema)
			.optional(),
		connect: z.lazy(() => BookmarkWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkCreateNestedOneWithoutAnnotationsInputObjectSchema = Schema;
