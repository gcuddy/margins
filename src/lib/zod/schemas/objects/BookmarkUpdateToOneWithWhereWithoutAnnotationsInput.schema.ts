import { z } from 'zod';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { BookmarkUpdateWithoutAnnotationsInputObjectSchema } from './BookmarkUpdateWithoutAnnotationsInput.schema';
import { BookmarkUncheckedUpdateWithoutAnnotationsInputObjectSchema } from './BookmarkUncheckedUpdateWithoutAnnotationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateToOneWithWhereWithoutAnnotationsInput> = z
	.object({
		where: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => BookmarkUpdateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateWithoutAnnotationsInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpdateToOneWithWhereWithoutAnnotationsInputObjectSchema = Schema;
