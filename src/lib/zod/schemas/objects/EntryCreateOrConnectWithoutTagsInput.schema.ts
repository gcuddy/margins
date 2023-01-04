import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryCreateWithoutTagsInputObjectSchema } from './EntryCreateWithoutTagsInput.schema';
import { EntryUncheckedCreateWithoutTagsInputObjectSchema } from './EntryUncheckedCreateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateOrConnectWithoutTagsInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryCreateWithoutTagsInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const EntryCreateOrConnectWithoutTagsInputObjectSchema = Schema;
