import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagCreateWithoutEntryInputObjectSchema } from './EntryTagCreateWithoutEntryInput.schema';
import { EntryTagUncheckedCreateWithoutEntryInputObjectSchema } from './EntryTagUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateOrConnectWithoutEntryInput> = z
	.object({
		where: z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryTagCreateWithoutEntryInputObjectSchema),
			z.lazy(() => EntryTagUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagCreateOrConnectWithoutEntryInputObjectSchema = Schema;
