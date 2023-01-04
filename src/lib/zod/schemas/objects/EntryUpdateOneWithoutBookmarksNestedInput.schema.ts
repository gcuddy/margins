import { z } from 'zod';
import { EntryCreateWithoutBookmarksInputObjectSchema } from './EntryCreateWithoutBookmarksInput.schema';
import { EntryUncheckedCreateWithoutBookmarksInputObjectSchema } from './EntryUncheckedCreateWithoutBookmarksInput.schema';
import { EntryCreateOrConnectWithoutBookmarksInputObjectSchema } from './EntryCreateOrConnectWithoutBookmarksInput.schema';
import { EntryUpsertWithoutBookmarksInputObjectSchema } from './EntryUpsertWithoutBookmarksInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateToOneWithWhereWithoutBookmarksInputObjectSchema } from './EntryUpdateToOneWithWhereWithoutBookmarksInput.schema';
import { EntryUpdateWithoutBookmarksInputObjectSchema } from './EntryUpdateWithoutBookmarksInput.schema';
import { EntryUncheckedUpdateWithoutBookmarksInputObjectSchema } from './EntryUncheckedUpdateWithoutBookmarksInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateOneWithoutBookmarksNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutBookmarksInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutBookmarksInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => EntryCreateOrConnectWithoutBookmarksInputObjectSchema).optional(),
		upsert: z.lazy(() => EntryUpsertWithoutBookmarksInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => EntryWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => EntryWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => EntryUpdateToOneWithWhereWithoutBookmarksInputObjectSchema),
				z.lazy(() => EntryUpdateWithoutBookmarksInputObjectSchema),
				z.lazy(() => EntryUncheckedUpdateWithoutBookmarksInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const EntryUpdateOneWithoutBookmarksNestedInputObjectSchema = Schema;
