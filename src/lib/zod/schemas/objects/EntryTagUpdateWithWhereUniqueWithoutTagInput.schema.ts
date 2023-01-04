import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagUpdateWithoutTagInputObjectSchema } from './EntryTagUpdateWithoutTagInput.schema';
import { EntryTagUncheckedUpdateWithoutTagInputObjectSchema } from './EntryTagUncheckedUpdateWithoutTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpdateWithWhereUniqueWithoutTagInput> = z
	.object({
		where: z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryTagUpdateWithoutTagInputObjectSchema),
			z.lazy(() => EntryTagUncheckedUpdateWithoutTagInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagUpdateWithWhereUniqueWithoutTagInputObjectSchema = Schema;
