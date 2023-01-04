import { z } from 'zod';
import { BookmarkCreateWithoutCollectionsInputObjectSchema } from './BookmarkCreateWithoutCollectionsInput.schema';
import { BookmarkUncheckedCreateWithoutCollectionsInputObjectSchema } from './BookmarkUncheckedCreateWithoutCollectionsInput.schema';
import { BookmarkCreateOrConnectWithoutCollectionsInputObjectSchema } from './BookmarkCreateOrConnectWithoutCollectionsInput.schema';
import { BookmarkUpsertWithoutCollectionsInputObjectSchema } from './BookmarkUpsertWithoutCollectionsInput.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateToOneWithWhereWithoutCollectionsInputObjectSchema } from './BookmarkUpdateToOneWithWhereWithoutCollectionsInput.schema';
import { BookmarkUpdateWithoutCollectionsInputObjectSchema } from './BookmarkUpdateWithoutCollectionsInput.schema';
import { BookmarkUncheckedUpdateWithoutCollectionsInputObjectSchema } from './BookmarkUncheckedUpdateWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateOneWithoutCollectionsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => BookmarkCreateWithoutCollectionsInputObjectSchema),
				z.lazy(() => BookmarkUncheckedCreateWithoutCollectionsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => BookmarkCreateOrConnectWithoutCollectionsInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => BookmarkUpsertWithoutCollectionsInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => BookmarkWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => BookmarkWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => BookmarkWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => BookmarkUpdateToOneWithWhereWithoutCollectionsInputObjectSchema),
				z.lazy(() => BookmarkUpdateWithoutCollectionsInputObjectSchema),
				z.lazy(() => BookmarkUncheckedUpdateWithoutCollectionsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const BookmarkUpdateOneWithoutCollectionsNestedInputObjectSchema = Schema;
