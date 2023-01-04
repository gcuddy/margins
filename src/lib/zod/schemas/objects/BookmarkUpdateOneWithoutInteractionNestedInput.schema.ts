import { z } from 'zod';
import { BookmarkCreateWithoutInteractionInputObjectSchema } from './BookmarkCreateWithoutInteractionInput.schema';
import { BookmarkUncheckedCreateWithoutInteractionInputObjectSchema } from './BookmarkUncheckedCreateWithoutInteractionInput.schema';
import { BookmarkCreateOrConnectWithoutInteractionInputObjectSchema } from './BookmarkCreateOrConnectWithoutInteractionInput.schema';
import { BookmarkUpsertWithoutInteractionInputObjectSchema } from './BookmarkUpsertWithoutInteractionInput.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateToOneWithWhereWithoutInteractionInputObjectSchema } from './BookmarkUpdateToOneWithWhereWithoutInteractionInput.schema';
import { BookmarkUpdateWithoutInteractionInputObjectSchema } from './BookmarkUpdateWithoutInteractionInput.schema';
import { BookmarkUncheckedUpdateWithoutInteractionInputObjectSchema } from './BookmarkUncheckedUpdateWithoutInteractionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateOneWithoutInteractionNestedInput> = z
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
		upsert: z.lazy(() => BookmarkUpsertWithoutInteractionInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => BookmarkWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => BookmarkWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => BookmarkWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => BookmarkUpdateToOneWithWhereWithoutInteractionInputObjectSchema),
				z.lazy(() => BookmarkUpdateWithoutInteractionInputObjectSchema),
				z.lazy(() => BookmarkUncheckedUpdateWithoutInteractionInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const BookmarkUpdateOneWithoutInteractionNestedInputObjectSchema = Schema;
