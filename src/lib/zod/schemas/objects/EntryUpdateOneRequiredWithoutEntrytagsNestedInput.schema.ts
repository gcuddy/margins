import { z } from 'zod';
import { EntryCreateWithoutEntrytagsInputObjectSchema } from './EntryCreateWithoutEntrytagsInput.schema';
import { EntryUncheckedCreateWithoutEntrytagsInputObjectSchema } from './EntryUncheckedCreateWithoutEntrytagsInput.schema';
import { EntryCreateOrConnectWithoutEntrytagsInputObjectSchema } from './EntryCreateOrConnectWithoutEntrytagsInput.schema';
import { EntryUpsertWithoutEntrytagsInputObjectSchema } from './EntryUpsertWithoutEntrytagsInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateToOneWithWhereWithoutEntrytagsInputObjectSchema } from './EntryUpdateToOneWithWhereWithoutEntrytagsInput.schema';
import { EntryUpdateWithoutEntrytagsInputObjectSchema } from './EntryUpdateWithoutEntrytagsInput.schema';
import { EntryUncheckedUpdateWithoutEntrytagsInputObjectSchema } from './EntryUncheckedUpdateWithoutEntrytagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateOneRequiredWithoutEntrytagsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutEntrytagsInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutEntrytagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => EntryCreateOrConnectWithoutEntrytagsInputObjectSchema).optional(),
		upsert: z.lazy(() => EntryUpsertWithoutEntrytagsInputObjectSchema).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => EntryUpdateToOneWithWhereWithoutEntrytagsInputObjectSchema),
				z.lazy(() => EntryUpdateWithoutEntrytagsInputObjectSchema),
				z.lazy(() => EntryUncheckedUpdateWithoutEntrytagsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const EntryUpdateOneRequiredWithoutEntrytagsNestedInputObjectSchema = Schema;
