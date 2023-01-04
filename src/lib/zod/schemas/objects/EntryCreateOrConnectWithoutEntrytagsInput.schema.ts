import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryCreateWithoutEntrytagsInputObjectSchema } from './EntryCreateWithoutEntrytagsInput.schema';
import { EntryUncheckedCreateWithoutEntrytagsInputObjectSchema } from './EntryUncheckedCreateWithoutEntrytagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateOrConnectWithoutEntrytagsInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryCreateWithoutEntrytagsInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutEntrytagsInputObjectSchema),
		]),
	})
	.strict();

export const EntryCreateOrConnectWithoutEntrytagsInputObjectSchema = Schema;
