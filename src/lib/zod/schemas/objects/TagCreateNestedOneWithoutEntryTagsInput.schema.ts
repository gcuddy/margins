import { z } from 'zod';
import { TagCreateWithoutEntryTagsInputObjectSchema } from './TagCreateWithoutEntryTagsInput.schema';
import { TagUncheckedCreateWithoutEntryTagsInputObjectSchema } from './TagUncheckedCreateWithoutEntryTagsInput.schema';
import { TagCreateOrConnectWithoutEntryTagsInputObjectSchema } from './TagCreateOrConnectWithoutEntryTagsInput.schema';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateNestedOneWithoutEntryTagsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TagCreateWithoutEntryTagsInputObjectSchema),
				z.lazy(() => TagUncheckedCreateWithoutEntryTagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => TagCreateOrConnectWithoutEntryTagsInputObjectSchema).optional(),
		connect: z.lazy(() => TagWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const TagCreateNestedOneWithoutEntryTagsInputObjectSchema = Schema;
