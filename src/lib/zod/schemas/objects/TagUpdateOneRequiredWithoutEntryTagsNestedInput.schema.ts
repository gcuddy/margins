import { z } from 'zod';
import { TagCreateWithoutEntryTagsInputObjectSchema } from './TagCreateWithoutEntryTagsInput.schema';
import { TagUncheckedCreateWithoutEntryTagsInputObjectSchema } from './TagUncheckedCreateWithoutEntryTagsInput.schema';
import { TagCreateOrConnectWithoutEntryTagsInputObjectSchema } from './TagCreateOrConnectWithoutEntryTagsInput.schema';
import { TagUpsertWithoutEntryTagsInputObjectSchema } from './TagUpsertWithoutEntryTagsInput.schema';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagUpdateToOneWithWhereWithoutEntryTagsInputObjectSchema } from './TagUpdateToOneWithWhereWithoutEntryTagsInput.schema';
import { TagUpdateWithoutEntryTagsInputObjectSchema } from './TagUpdateWithoutEntryTagsInput.schema';
import { TagUncheckedUpdateWithoutEntryTagsInputObjectSchema } from './TagUncheckedUpdateWithoutEntryTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpdateOneRequiredWithoutEntryTagsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TagCreateWithoutEntryTagsInputObjectSchema),
				z.lazy(() => TagUncheckedCreateWithoutEntryTagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutEntryTagsInputObjectSchema).optional(),
		upsert: z.lazy(() => TagUpsertWithoutEntryTagsInputObjectSchema).optional(),
		connect: z.lazy(() => TagWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => TagUpdateToOneWithWhereWithoutEntryTagsInputObjectSchema),
				z.lazy(() => TagUpdateWithoutEntryTagsInputObjectSchema),
				z.lazy(() => TagUncheckedUpdateWithoutEntryTagsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const TagUpdateOneRequiredWithoutEntryTagsNestedInputObjectSchema = Schema;
