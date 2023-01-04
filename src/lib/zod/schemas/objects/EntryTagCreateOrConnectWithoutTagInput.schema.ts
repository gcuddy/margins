import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagCreateWithoutTagInputObjectSchema } from './EntryTagCreateWithoutTagInput.schema';
import { EntryTagUncheckedCreateWithoutTagInputObjectSchema } from './EntryTagUncheckedCreateWithoutTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateOrConnectWithoutTagInput> = z
	.object({
		where: z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryTagCreateWithoutTagInputObjectSchema),
			z.lazy(() => EntryTagUncheckedCreateWithoutTagInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagCreateOrConnectWithoutTagInputObjectSchema = Schema;
