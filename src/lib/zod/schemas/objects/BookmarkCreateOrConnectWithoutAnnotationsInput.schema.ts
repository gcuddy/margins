import { z } from 'zod';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkCreateWithoutAnnotationsInputObjectSchema } from './BookmarkCreateWithoutAnnotationsInput.schema';
import { BookmarkUncheckedCreateWithoutAnnotationsInputObjectSchema } from './BookmarkUncheckedCreateWithoutAnnotationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateOrConnectWithoutAnnotationsInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => BookmarkCreateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedCreateWithoutAnnotationsInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkCreateOrConnectWithoutAnnotationsInputObjectSchema = Schema;
