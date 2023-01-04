import { z } from 'zod';
import { EntryCreateWithoutEntryMediaInputObjectSchema } from './EntryCreateWithoutEntryMediaInput.schema';
import { EntryUncheckedCreateWithoutEntryMediaInputObjectSchema } from './EntryUncheckedCreateWithoutEntryMediaInput.schema';
import { EntryCreateOrConnectWithoutEntryMediaInputObjectSchema } from './EntryCreateOrConnectWithoutEntryMediaInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateNestedOneWithoutEntryMediaInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutEntryMediaInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutEntryMediaInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => EntryCreateOrConnectWithoutEntryMediaInputObjectSchema)
			.optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const EntryCreateNestedOneWithoutEntryMediaInputObjectSchema = Schema;
