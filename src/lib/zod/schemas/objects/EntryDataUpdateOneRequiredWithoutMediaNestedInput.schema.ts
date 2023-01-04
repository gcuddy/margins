import { z } from 'zod';
import { EntryDataCreateWithoutMediaInputObjectSchema } from './EntryDataCreateWithoutMediaInput.schema';
import { EntryDataUncheckedCreateWithoutMediaInputObjectSchema } from './EntryDataUncheckedCreateWithoutMediaInput.schema';
import { EntryDataCreateOrConnectWithoutMediaInputObjectSchema } from './EntryDataCreateOrConnectWithoutMediaInput.schema';
import { EntryDataUpsertWithoutMediaInputObjectSchema } from './EntryDataUpsertWithoutMediaInput.schema';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';
import { EntryDataUpdateToOneWithWhereWithoutMediaInputObjectSchema } from './EntryDataUpdateToOneWithWhereWithoutMediaInput.schema';
import { EntryDataUpdateWithoutMediaInputObjectSchema } from './EntryDataUpdateWithoutMediaInput.schema';
import { EntryDataUncheckedUpdateWithoutMediaInputObjectSchema } from './EntryDataUncheckedUpdateWithoutMediaInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpdateOneRequiredWithoutMediaNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryDataCreateWithoutMediaInputObjectSchema),
				z.lazy(() => EntryDataUncheckedCreateWithoutMediaInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => EntryDataCreateOrConnectWithoutMediaInputObjectSchema).optional(),
		upsert: z.lazy(() => EntryDataUpsertWithoutMediaInputObjectSchema).optional(),
		connect: z.lazy(() => EntryDataWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => EntryDataUpdateToOneWithWhereWithoutMediaInputObjectSchema),
				z.lazy(() => EntryDataUpdateWithoutMediaInputObjectSchema),
				z.lazy(() => EntryDataUncheckedUpdateWithoutMediaInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const EntryDataUpdateOneRequiredWithoutMediaNestedInputObjectSchema = Schema;
