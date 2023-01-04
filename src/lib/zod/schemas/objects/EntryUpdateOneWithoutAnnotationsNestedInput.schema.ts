import { z } from 'zod';
import { EntryCreateWithoutAnnotationsInputObjectSchema } from './EntryCreateWithoutAnnotationsInput.schema';
import { EntryUncheckedCreateWithoutAnnotationsInputObjectSchema } from './EntryUncheckedCreateWithoutAnnotationsInput.schema';
import { EntryCreateOrConnectWithoutAnnotationsInputObjectSchema } from './EntryCreateOrConnectWithoutAnnotationsInput.schema';
import { EntryUpsertWithoutAnnotationsInputObjectSchema } from './EntryUpsertWithoutAnnotationsInput.schema';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateToOneWithWhereWithoutAnnotationsInputObjectSchema } from './EntryUpdateToOneWithWhereWithoutAnnotationsInput.schema';
import { EntryUpdateWithoutAnnotationsInputObjectSchema } from './EntryUpdateWithoutAnnotationsInput.schema';
import { EntryUncheckedUpdateWithoutAnnotationsInputObjectSchema } from './EntryUncheckedUpdateWithoutAnnotationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateOneWithoutAnnotationsNestedInput> = z
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
		upsert: z.lazy(() => EntryUpsertWithoutAnnotationsInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => EntryWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => EntryWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => EntryWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => EntryUpdateToOneWithWhereWithoutAnnotationsInputObjectSchema),
				z.lazy(() => EntryUpdateWithoutAnnotationsInputObjectSchema),
				z.lazy(() => EntryUncheckedUpdateWithoutAnnotationsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const EntryUpdateOneWithoutAnnotationsNestedInputObjectSchema = Schema;
