import { z } from 'zod';
import { TagCreateWithoutTaggingsInputObjectSchema } from './TagCreateWithoutTaggingsInput.schema';
import { TagUncheckedCreateWithoutTaggingsInputObjectSchema } from './TagUncheckedCreateWithoutTaggingsInput.schema';
import { TagCreateOrConnectWithoutTaggingsInputObjectSchema } from './TagCreateOrConnectWithoutTaggingsInput.schema';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateNestedOneWithoutTaggingsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TagCreateWithoutTaggingsInputObjectSchema),
				z.lazy(() => TagUncheckedCreateWithoutTaggingsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutTaggingsInputObjectSchema).optional(),
		connect: z.lazy(() => TagWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const TagCreateNestedOneWithoutTaggingsInputObjectSchema = Schema;
