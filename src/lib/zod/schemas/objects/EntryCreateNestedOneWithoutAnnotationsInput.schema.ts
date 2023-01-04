import { z } from 'zod';
import { EntryCreateWithoutAnnotationsInputObjectSchema } from './EntryCreateWithoutAnnotationsInput.schema';
import { EntryUncheckedCreateWithoutAnnotationsInputObjectSchema } from './EntryUncheckedCreateWithoutAnnotationsInput.schema';
import { EntryCreateOrConnectWithoutAnnotationsInputObjectSchema } from './EntryCreateOrConnectWithoutAnnotationsInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateNestedOneWithoutAnnotationsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutAnnotationsInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutAnnotationsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => EntryCreateOrConnectWithoutAnnotationsInputObjectSchema)
			.optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const EntryCreateNestedOneWithoutAnnotationsInputObjectSchema = Schema;
