import { z } from 'zod';
import { EntryCreateWithoutInteractionsInputObjectSchema } from './EntryCreateWithoutInteractionsInput.schema';
import { EntryUncheckedCreateWithoutInteractionsInputObjectSchema } from './EntryUncheckedCreateWithoutInteractionsInput.schema';
import { EntryCreateOrConnectWithoutInteractionsInputObjectSchema } from './EntryCreateOrConnectWithoutInteractionsInput.schema';
import { EntryUpsertWithoutInteractionsInputObjectSchema } from './EntryUpsertWithoutInteractionsInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateToOneWithWhereWithoutInteractionsInputObjectSchema } from './EntryUpdateToOneWithWhereWithoutInteractionsInput.schema';
import { EntryUpdateWithoutInteractionsInputObjectSchema } from './EntryUpdateWithoutInteractionsInput.schema';
import { EntryUncheckedUpdateWithoutInteractionsInputObjectSchema } from './EntryUncheckedUpdateWithoutInteractionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateOneRequiredWithoutInteractionsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutInteractionsInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutInteractionsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => EntryCreateOrConnectWithoutInteractionsInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => EntryUpsertWithoutInteractionsInputObjectSchema).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => EntryUpdateToOneWithWhereWithoutInteractionsInputObjectSchema),
				z.lazy(() => EntryUpdateWithoutInteractionsInputObjectSchema),
				z.lazy(() => EntryUncheckedUpdateWithoutInteractionsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const EntryUpdateOneRequiredWithoutInteractionsNestedInputObjectSchema = Schema;
