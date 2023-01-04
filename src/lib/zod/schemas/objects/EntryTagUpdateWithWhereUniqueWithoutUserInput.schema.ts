import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagUpdateWithoutUserInputObjectSchema } from './EntryTagUpdateWithoutUserInput.schema';
import { EntryTagUncheckedUpdateWithoutUserInputObjectSchema } from './EntryTagUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryTagUpdateWithoutUserInputObjectSchema),
			z.lazy(() => EntryTagUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
