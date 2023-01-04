import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagCreateWithoutEntryTagsInputObjectSchema } from './TagCreateWithoutEntryTagsInput.schema';
import { TagUncheckedCreateWithoutEntryTagsInputObjectSchema } from './TagUncheckedCreateWithoutEntryTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateOrConnectWithoutEntryTagsInput> = z
	.object({
		where: z.lazy(() => TagWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => TagCreateWithoutEntryTagsInputObjectSchema),
			z.lazy(() => TagUncheckedCreateWithoutEntryTagsInputObjectSchema),
		]),
	})
	.strict();

export const TagCreateOrConnectWithoutEntryTagsInputObjectSchema = Schema;
