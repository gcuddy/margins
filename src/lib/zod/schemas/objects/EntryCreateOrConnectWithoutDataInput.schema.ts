import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryCreateWithoutDataInputObjectSchema } from './EntryCreateWithoutDataInput.schema';
import { EntryUncheckedCreateWithoutDataInputObjectSchema } from './EntryUncheckedCreateWithoutDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateOrConnectWithoutDataInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryCreateWithoutDataInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutDataInputObjectSchema),
		]),
	})
	.strict();

export const EntryCreateOrConnectWithoutDataInputObjectSchema = Schema;
