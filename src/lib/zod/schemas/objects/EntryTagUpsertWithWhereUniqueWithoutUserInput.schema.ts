import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagUpdateWithoutUserInputObjectSchema } from './EntryTagUpdateWithoutUserInput.schema';
import { EntryTagUncheckedUpdateWithoutUserInputObjectSchema } from './EntryTagUncheckedUpdateWithoutUserInput.schema';
import { EntryTagCreateWithoutUserInputObjectSchema } from './EntryTagCreateWithoutUserInput.schema';
import { EntryTagUncheckedCreateWithoutUserInputObjectSchema } from './EntryTagUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => EntryTagUpdateWithoutUserInputObjectSchema),
			z.lazy(() => EntryTagUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryTagCreateWithoutUserInputObjectSchema),
			z.lazy(() => EntryTagUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
