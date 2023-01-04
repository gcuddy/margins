import { z } from 'zod';
import { EntryCreateWithoutBookmarksInputObjectSchema } from './EntryCreateWithoutBookmarksInput.schema';
import { EntryUncheckedCreateWithoutBookmarksInputObjectSchema } from './EntryUncheckedCreateWithoutBookmarksInput.schema';
import { EntryCreateOrConnectWithoutBookmarksInputObjectSchema } from './EntryCreateOrConnectWithoutBookmarksInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateNestedOneWithoutBookmarksInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutBookmarksInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutBookmarksInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => EntryCreateOrConnectWithoutBookmarksInputObjectSchema).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const EntryCreateNestedOneWithoutBookmarksInputObjectSchema = Schema;
