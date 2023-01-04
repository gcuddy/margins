import { z } from 'zod';
import { EntryCreateWithoutContextInputObjectSchema } from './EntryCreateWithoutContextInput.schema';
import { EntryUncheckedCreateWithoutContextInputObjectSchema } from './EntryUncheckedCreateWithoutContextInput.schema';
import { EntryCreateOrConnectWithoutContextInputObjectSchema } from './EntryCreateOrConnectWithoutContextInput.schema';
import { EntryUpsertWithoutContextInputObjectSchema } from './EntryUpsertWithoutContextInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateToOneWithWhereWithoutContextInputObjectSchema } from './EntryUpdateToOneWithWhereWithoutContextInput.schema';
import { EntryUpdateWithoutContextInputObjectSchema } from './EntryUpdateWithoutContextInput.schema';
import { EntryUncheckedUpdateWithoutContextInputObjectSchema } from './EntryUncheckedUpdateWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateOneWithoutContextNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutContextInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutContextInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => EntryCreateOrConnectWithoutContextInputObjectSchema).optional(),
		upsert: z.lazy(() => EntryUpsertWithoutContextInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => EntryWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => EntryWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => EntryUpdateToOneWithWhereWithoutContextInputObjectSchema),
				z.lazy(() => EntryUpdateWithoutContextInputObjectSchema),
				z.lazy(() => EntryUncheckedUpdateWithoutContextInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const EntryUpdateOneWithoutContextNestedInputObjectSchema = Schema;
