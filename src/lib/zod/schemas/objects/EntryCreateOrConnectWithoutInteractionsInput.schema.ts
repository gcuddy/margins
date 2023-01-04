import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryCreateWithoutInteractionsInputObjectSchema } from './EntryCreateWithoutInteractionsInput.schema';
import { EntryUncheckedCreateWithoutInteractionsInputObjectSchema } from './EntryUncheckedCreateWithoutInteractionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateOrConnectWithoutInteractionsInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryCreateWithoutInteractionsInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutInteractionsInputObjectSchema),
		]),
	})
	.strict();

export const EntryCreateOrConnectWithoutInteractionsInputObjectSchema = Schema;
