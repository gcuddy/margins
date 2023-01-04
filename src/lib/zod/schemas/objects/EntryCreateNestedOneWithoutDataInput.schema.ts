import { z } from 'zod';
import { EntryCreateWithoutDataInputObjectSchema } from './EntryCreateWithoutDataInput.schema';
import { EntryUncheckedCreateWithoutDataInputObjectSchema } from './EntryUncheckedCreateWithoutDataInput.schema';
import { EntryCreateOrConnectWithoutDataInputObjectSchema } from './EntryCreateOrConnectWithoutDataInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateNestedOneWithoutDataInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutDataInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutDataInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => EntryCreateOrConnectWithoutDataInputObjectSchema).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const EntryCreateNestedOneWithoutDataInputObjectSchema = Schema;
