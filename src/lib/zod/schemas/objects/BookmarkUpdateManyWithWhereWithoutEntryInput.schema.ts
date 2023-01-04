import { z } from 'zod';
import { BookmarkScalarWhereInputObjectSchema } from './BookmarkScalarWhereInput.schema';
import { BookmarkUpdateManyMutationInputObjectSchema } from './BookmarkUpdateManyMutationInput.schema';
import { BookmarkUncheckedUpdateManyWithoutBookmarksInputObjectSchema } from './BookmarkUncheckedUpdateManyWithoutBookmarksInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateManyWithWhereWithoutEntryInput> = z
	.object({
		where: z.lazy(() => BookmarkScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => BookmarkUpdateManyMutationInputObjectSchema),
			z.lazy(() => BookmarkUncheckedUpdateManyWithoutBookmarksInputObjectSchema),
		]),
	})
	.strict();

export const BookmarkUpdateManyWithWhereWithoutEntryInputObjectSchema = Schema;
