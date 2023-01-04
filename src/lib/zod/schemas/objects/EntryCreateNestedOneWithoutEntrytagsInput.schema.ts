import { z } from 'zod';
import { EntryCreateWithoutEntrytagsInputObjectSchema } from './EntryCreateWithoutEntrytagsInput.schema';
import { EntryUncheckedCreateWithoutEntrytagsInputObjectSchema } from './EntryUncheckedCreateWithoutEntrytagsInput.schema';
import { EntryCreateOrConnectWithoutEntrytagsInputObjectSchema } from './EntryCreateOrConnectWithoutEntrytagsInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateNestedOneWithoutEntrytagsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutEntrytagsInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutEntrytagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => EntryCreateOrConnectWithoutEntrytagsInputObjectSchema).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const EntryCreateNestedOneWithoutEntrytagsInputObjectSchema = Schema;
