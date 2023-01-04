import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryCreateWithoutContextInputObjectSchema } from './EntryCreateWithoutContextInput.schema';
import { EntryUncheckedCreateWithoutContextInputObjectSchema } from './EntryUncheckedCreateWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateOrConnectWithoutContextInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryCreateWithoutContextInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutContextInputObjectSchema),
		]),
	})
	.strict();

export const EntryCreateOrConnectWithoutContextInputObjectSchema = Schema;
