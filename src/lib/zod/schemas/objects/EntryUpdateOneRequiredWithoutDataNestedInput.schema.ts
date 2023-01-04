import { z } from 'zod';
import { EntryCreateWithoutDataInputObjectSchema } from './EntryCreateWithoutDataInput.schema';
import { EntryUncheckedCreateWithoutDataInputObjectSchema } from './EntryUncheckedCreateWithoutDataInput.schema';
import { EntryCreateOrConnectWithoutDataInputObjectSchema } from './EntryCreateOrConnectWithoutDataInput.schema';
import { EntryUpsertWithoutDataInputObjectSchema } from './EntryUpsertWithoutDataInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateToOneWithWhereWithoutDataInputObjectSchema } from './EntryUpdateToOneWithWhereWithoutDataInput.schema';
import { EntryUpdateWithoutDataInputObjectSchema } from './EntryUpdateWithoutDataInput.schema';
import { EntryUncheckedUpdateWithoutDataInputObjectSchema } from './EntryUncheckedUpdateWithoutDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateOneRequiredWithoutDataNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutDataInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutDataInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => EntryCreateOrConnectWithoutDataInputObjectSchema).optional(),
		upsert: z.lazy(() => EntryUpsertWithoutDataInputObjectSchema).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => EntryUpdateToOneWithWhereWithoutDataInputObjectSchema),
				z.lazy(() => EntryUpdateWithoutDataInputObjectSchema),
				z.lazy(() => EntryUncheckedUpdateWithoutDataInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const EntryUpdateOneRequiredWithoutDataNestedInputObjectSchema = Schema;
