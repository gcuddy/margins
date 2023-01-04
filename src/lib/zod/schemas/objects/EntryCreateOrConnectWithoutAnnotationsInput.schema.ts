import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryCreateWithoutAnnotationsInputObjectSchema } from './EntryCreateWithoutAnnotationsInput.schema';
import { EntryUncheckedCreateWithoutAnnotationsInputObjectSchema } from './EntryUncheckedCreateWithoutAnnotationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateOrConnectWithoutAnnotationsInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryCreateWithoutAnnotationsInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutAnnotationsInputObjectSchema),
		]),
	})
	.strict();

export const EntryCreateOrConnectWithoutAnnotationsInputObjectSchema = Schema;
