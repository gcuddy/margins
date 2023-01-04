import { z } from 'zod';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';
import { EntryDataCreateWithoutMediaInputObjectSchema } from './EntryDataCreateWithoutMediaInput.schema';
import { EntryDataUncheckedCreateWithoutMediaInputObjectSchema } from './EntryDataUncheckedCreateWithoutMediaInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataCreateOrConnectWithoutMediaInput> = z
	.object({
		where: z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryDataCreateWithoutMediaInputObjectSchema),
			z.lazy(() => EntryDataUncheckedCreateWithoutMediaInputObjectSchema),
		]),
	})
	.strict();

export const EntryDataCreateOrConnectWithoutMediaInputObjectSchema = Schema;
