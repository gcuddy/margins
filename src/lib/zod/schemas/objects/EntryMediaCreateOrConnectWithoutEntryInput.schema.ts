import { z } from 'zod';
import { EntryMediaWhereUniqueInputObjectSchema } from './EntryMediaWhereUniqueInput.schema';
import { EntryMediaCreateWithoutEntryInputObjectSchema } from './EntryMediaCreateWithoutEntryInput.schema';
import { EntryMediaUncheckedCreateWithoutEntryInputObjectSchema } from './EntryMediaUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaCreateOrConnectWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryMediaCreateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryMediaUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const EntryMediaCreateOrConnectWithoutEntryInputObjectSchema = Schema;
