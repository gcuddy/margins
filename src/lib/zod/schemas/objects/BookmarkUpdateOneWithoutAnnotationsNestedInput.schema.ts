import { z } from 'zod';
import { BookmarkCreateWithoutAnnotationsInputObjectSchema } from './BookmarkCreateWithoutAnnotationsInput.schema';
import { BookmarkUncheckedCreateWithoutAnnotationsInputObjectSchema } from './BookmarkUncheckedCreateWithoutAnnotationsInput.schema';
import { BookmarkCreateOrConnectWithoutAnnotationsInputObjectSchema } from './BookmarkCreateOrConnectWithoutAnnotationsInput.schema';
import { BookmarkUpsertWithoutAnnotationsInputObjectSchema } from './BookmarkUpsertWithoutAnnotationsInput.schema';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateToOneWithWhereWithoutAnnotationsInputObjectSchema } from './BookmarkUpdateToOneWithWhereWithoutAnnotationsInput.schema';
import { BookmarkUpdateWithoutAnnotationsInputObjectSchema } from './BookmarkUpdateWithoutAnnotationsInput.schema';
import { BookmarkUncheckedUpdateWithoutAnnotationsInputObjectSchema } from './BookmarkUncheckedUpdateWithoutAnnotationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUpdateOneWithoutAnnotationsNestedInput> = z
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
		upsert: z.lazy(() => BookmarkUpsertWithoutAnnotationsInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => BookmarkWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => BookmarkWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => BookmarkWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => BookmarkUpdateToOneWithWhereWithoutAnnotationsInputObjectSchema),
				z.lazy(() => BookmarkUpdateWithoutAnnotationsInputObjectSchema),
				z.lazy(() => BookmarkUncheckedUpdateWithoutAnnotationsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const BookmarkUpdateOneWithoutAnnotationsNestedInputObjectSchema = Schema;
