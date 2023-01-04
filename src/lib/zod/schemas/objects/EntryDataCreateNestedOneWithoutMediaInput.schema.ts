import { z } from 'zod';
import { EntryDataCreateWithoutMediaInputObjectSchema } from './EntryDataCreateWithoutMediaInput.schema';
import { EntryDataUncheckedCreateWithoutMediaInputObjectSchema } from './EntryDataUncheckedCreateWithoutMediaInput.schema';
import { EntryDataCreateOrConnectWithoutMediaInputObjectSchema } from './EntryDataCreateOrConnectWithoutMediaInput.schema';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataCreateNestedOneWithoutMediaInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryDataCreateWithoutMediaInputObjectSchema),
				z.lazy(() => EntryDataUncheckedCreateWithoutMediaInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => EntryDataCreateOrConnectWithoutMediaInputObjectSchema).optional(),
		connect: z.lazy(() => EntryDataWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const EntryDataCreateNestedOneWithoutMediaInputObjectSchema = Schema;
