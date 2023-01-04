import { z } from 'zod';
import { TagCreateWithoutTaggingsInputObjectSchema } from './TagCreateWithoutTaggingsInput.schema';
import { TagUncheckedCreateWithoutTaggingsInputObjectSchema } from './TagUncheckedCreateWithoutTaggingsInput.schema';
import { TagCreateOrConnectWithoutTaggingsInputObjectSchema } from './TagCreateOrConnectWithoutTaggingsInput.schema';
import { TagUpsertWithoutTaggingsInputObjectSchema } from './TagUpsertWithoutTaggingsInput.schema';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagUpdateToOneWithWhereWithoutTaggingsInputObjectSchema } from './TagUpdateToOneWithWhereWithoutTaggingsInput.schema';
import { TagUpdateWithoutTaggingsInputObjectSchema } from './TagUpdateWithoutTaggingsInput.schema';
import { TagUncheckedUpdateWithoutTaggingsInputObjectSchema } from './TagUncheckedUpdateWithoutTaggingsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpdateOneRequiredWithoutTaggingsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TagCreateWithoutTaggingsInputObjectSchema),
				z.lazy(() => TagUncheckedCreateWithoutTaggingsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutTaggingsInputObjectSchema).optional(),
		upsert: z.lazy(() => TagUpsertWithoutTaggingsInputObjectSchema).optional(),
		connect: z.lazy(() => TagWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => TagUpdateToOneWithWhereWithoutTaggingsInputObjectSchema),
				z.lazy(() => TagUpdateWithoutTaggingsInputObjectSchema),
				z.lazy(() => TagUncheckedUpdateWithoutTaggingsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const TagUpdateOneRequiredWithoutTaggingsNestedInputObjectSchema = Schema;
