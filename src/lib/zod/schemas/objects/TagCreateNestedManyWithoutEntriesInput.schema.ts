import { z } from 'zod';
import { TagCreateWithoutEntriesInputObjectSchema } from './TagCreateWithoutEntriesInput.schema';
import { TagUncheckedCreateWithoutEntriesInputObjectSchema } from './TagUncheckedCreateWithoutEntriesInput.schema';
import { TagCreateOrConnectWithoutEntriesInputObjectSchema } from './TagCreateOrConnectWithoutEntriesInput.schema';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateNestedManyWithoutEntriesInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TagCreateWithoutEntriesInputObjectSchema),
				z.lazy(() => TagCreateWithoutEntriesInputObjectSchema).array(),
				z.lazy(() => TagUncheckedCreateWithoutEntriesInputObjectSchema),
				z.lazy(() => TagUncheckedCreateWithoutEntriesInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TagCreateOrConnectWithoutEntriesInputObjectSchema),
				z.lazy(() => TagCreateOrConnectWithoutEntriesInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => TagWhereUniqueInputObjectSchema),
				z.lazy(() => TagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const TagCreateNestedManyWithoutEntriesInputObjectSchema = Schema;
