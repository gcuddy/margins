import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateWithoutTagsInputObjectSchema } from './EntryUpdateWithoutTagsInput.schema';
import { EntryUncheckedUpdateWithoutTagsInputObjectSchema } from './EntryUncheckedUpdateWithoutTagsInput.schema';
import { EntryCreateWithoutTagsInputObjectSchema } from './EntryCreateWithoutTagsInput.schema';
import { EntryUncheckedCreateWithoutTagsInputObjectSchema } from './EntryUncheckedCreateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpsertWithWhereUniqueWithoutTagsInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => EntryUpdateWithoutTagsInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutTagsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryCreateWithoutTagsInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpsertWithWhereUniqueWithoutTagsInputObjectSchema = Schema;
