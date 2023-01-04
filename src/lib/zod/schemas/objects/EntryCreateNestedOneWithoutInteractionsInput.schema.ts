import { z } from 'zod';
import { EntryCreateWithoutInteractionsInputObjectSchema } from './EntryCreateWithoutInteractionsInput.schema';
import { EntryUncheckedCreateWithoutInteractionsInputObjectSchema } from './EntryUncheckedCreateWithoutInteractionsInput.schema';
import { EntryCreateOrConnectWithoutInteractionsInputObjectSchema } from './EntryCreateOrConnectWithoutInteractionsInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateNestedOneWithoutInteractionsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutInteractionsInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutInteractionsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => EntryCreateOrConnectWithoutInteractionsInputObjectSchema)
			.optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const EntryCreateNestedOneWithoutInteractionsInputObjectSchema = Schema;
