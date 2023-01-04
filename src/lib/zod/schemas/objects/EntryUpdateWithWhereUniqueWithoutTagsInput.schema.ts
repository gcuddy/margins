import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateWithoutTagsInputObjectSchema } from './EntryUpdateWithoutTagsInput.schema';
import { EntryUncheckedUpdateWithoutTagsInputObjectSchema } from './EntryUncheckedUpdateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateWithWhereUniqueWithoutTagsInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryUpdateWithoutTagsInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpdateWithWhereUniqueWithoutTagsInputObjectSchema = Schema;
