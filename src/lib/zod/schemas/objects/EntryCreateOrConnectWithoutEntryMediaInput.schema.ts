import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryCreateWithoutEntryMediaInputObjectSchema } from './EntryCreateWithoutEntryMediaInput.schema';
import { EntryUncheckedCreateWithoutEntryMediaInputObjectSchema } from './EntryUncheckedCreateWithoutEntryMediaInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateOrConnectWithoutEntryMediaInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryCreateWithoutEntryMediaInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutEntryMediaInputObjectSchema),
		]),
	})
	.strict();

export const EntryCreateOrConnectWithoutEntryMediaInputObjectSchema = Schema;
