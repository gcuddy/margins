import { z } from 'zod';
import { EntryCreateWithoutTagsInputObjectSchema } from './EntryCreateWithoutTagsInput.schema';
import { EntryUncheckedCreateWithoutTagsInputObjectSchema } from './EntryUncheckedCreateWithoutTagsInput.schema';
import { EntryCreateOrConnectWithoutTagsInputObjectSchema } from './EntryCreateOrConnectWithoutTagsInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateNestedManyWithoutTagsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutTagsInputObjectSchema),
				z.lazy(() => EntryCreateWithoutTagsInputObjectSchema).array(),
				z.lazy(() => EntryUncheckedCreateWithoutTagsInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutTagsInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryCreateOrConnectWithoutTagsInputObjectSchema),
				z.lazy(() => EntryCreateOrConnectWithoutTagsInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => EntryWhereUniqueInputObjectSchema),
				z.lazy(() => EntryWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryCreateNestedManyWithoutTagsInputObjectSchema = Schema;
