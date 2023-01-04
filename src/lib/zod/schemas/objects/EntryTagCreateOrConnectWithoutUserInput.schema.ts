import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagCreateWithoutUserInputObjectSchema } from './EntryTagCreateWithoutUserInput.schema';
import { EntryTagUncheckedCreateWithoutUserInputObjectSchema } from './EntryTagUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryTagCreateWithoutUserInputObjectSchema),
			z.lazy(() => EntryTagUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagCreateOrConnectWithoutUserInputObjectSchema = Schema;
