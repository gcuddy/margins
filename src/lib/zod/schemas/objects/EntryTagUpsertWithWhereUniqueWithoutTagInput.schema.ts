import { z } from 'zod';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagUpdateWithoutTagInputObjectSchema } from './EntryTagUpdateWithoutTagInput.schema';
import { EntryTagUncheckedUpdateWithoutTagInputObjectSchema } from './EntryTagUncheckedUpdateWithoutTagInput.schema';
import { EntryTagCreateWithoutTagInputObjectSchema } from './EntryTagCreateWithoutTagInput.schema';
import { EntryTagUncheckedCreateWithoutTagInputObjectSchema } from './EntryTagUncheckedCreateWithoutTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUpsertWithWhereUniqueWithoutTagInput> = z
	.object({
		where: z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => EntryTagUpdateWithoutTagInputObjectSchema),
			z.lazy(() => EntryTagUncheckedUpdateWithoutTagInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryTagCreateWithoutTagInputObjectSchema),
			z.lazy(() => EntryTagUncheckedCreateWithoutTagInputObjectSchema),
		]),
	})
	.strict();

export const EntryTagUpsertWithWhereUniqueWithoutTagInputObjectSchema = Schema;
