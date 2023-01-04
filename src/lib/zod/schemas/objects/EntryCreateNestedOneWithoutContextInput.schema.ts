import { z } from 'zod';
import { EntryCreateWithoutContextInputObjectSchema } from './EntryCreateWithoutContextInput.schema';
import { EntryUncheckedCreateWithoutContextInputObjectSchema } from './EntryUncheckedCreateWithoutContextInput.schema';
import { EntryCreateOrConnectWithoutContextInputObjectSchema } from './EntryCreateOrConnectWithoutContextInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateNestedOneWithoutContextInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutContextInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutContextInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => EntryCreateOrConnectWithoutContextInputObjectSchema).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const EntryCreateNestedOneWithoutContextInputObjectSchema = Schema;
