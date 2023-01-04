import { z } from 'zod';
import { BookmarkCreateWithoutTagsInputObjectSchema } from './BookmarkCreateWithoutTagsInput.schema';
import { BookmarkUncheckedCreateWithoutTagsInputObjectSchema } from './BookmarkUncheckedCreateWithoutTagsInput.schema';
import { BookmarkCreateOrConnectWithoutTagsInputObjectSchema } from './BookmarkCreateOrConnectWithoutTagsInput.schema';
import { BookmarkUpsertWithoutTagsInputObjectSchema } from './BookmarkUpsertWithoutTagsInput.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateToOneWithWhereWithoutTagsInputObjectSchema } from './BookmarkUpdateToOneWithWhereWithoutTagsInput.schema';
import { BookmarkUpdateWithoutTagsInputObjectSchema } from './BookmarkUpdateWithoutTagsInput.schema';
import { BookmarkUncheckedUpdateWithoutTagsInputObjectSchema } from './BookmarkUncheckedUpdateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateOneWithoutTagsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => BookmarkCreateWithoutTagsInputObjectSchema),
				z.lazy(() => BookmarkUncheckedCreateWithoutTagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => BookmarkCreateOrConnectWithoutTagsInputObjectSchema).optional(),
		upsert: z.lazy(() => BookmarkUpsertWithoutTagsInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => BookmarkWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => BookmarkWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => BookmarkWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => BookmarkUpdateToOneWithWhereWithoutTagsInputObjectSchema),
				z.lazy(() => BookmarkUpdateWithoutTagsInputObjectSchema),
				z.lazy(() => BookmarkUncheckedUpdateWithoutTagsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const BookmarkUpdateOneWithoutTagsNestedInputObjectSchema = Schema;
