import { z } from 'zod';
import { EntryCreateWithoutEntryMediaInputObjectSchema } from './EntryCreateWithoutEntryMediaInput.schema';
import { EntryUncheckedCreateWithoutEntryMediaInputObjectSchema } from './EntryUncheckedCreateWithoutEntryMediaInput.schema';
import { EntryCreateOrConnectWithoutEntryMediaInputObjectSchema } from './EntryCreateOrConnectWithoutEntryMediaInput.schema';
import { EntryUpsertWithoutEntryMediaInputObjectSchema } from './EntryUpsertWithoutEntryMediaInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateToOneWithWhereWithoutEntryMediaInputObjectSchema } from './EntryUpdateToOneWithWhereWithoutEntryMediaInput.schema';
import { EntryUpdateWithoutEntryMediaInputObjectSchema } from './EntryUpdateWithoutEntryMediaInput.schema';
import { EntryUncheckedUpdateWithoutEntryMediaInputObjectSchema } from './EntryUncheckedUpdateWithoutEntryMediaInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateOneWithoutEntryMediaNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutEntryMediaInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutEntryMediaInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => EntryCreateOrConnectWithoutEntryMediaInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => EntryUpsertWithoutEntryMediaInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => EntryWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => EntryWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => EntryUpdateToOneWithWhereWithoutEntryMediaInputObjectSchema),
				z.lazy(() => EntryUpdateWithoutEntryMediaInputObjectSchema),
				z.lazy(() => EntryUncheckedUpdateWithoutEntryMediaInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const EntryUpdateOneWithoutEntryMediaNestedInputObjectSchema = Schema;
