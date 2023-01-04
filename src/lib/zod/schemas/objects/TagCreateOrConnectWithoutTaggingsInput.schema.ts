import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagCreateWithoutTaggingsInputObjectSchema } from './TagCreateWithoutTaggingsInput.schema';
import { TagUncheckedCreateWithoutTaggingsInputObjectSchema } from './TagUncheckedCreateWithoutTaggingsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateOrConnectWithoutTaggingsInput> = z
	.object({
		where: z.lazy(() => TagWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => TagCreateWithoutTaggingsInputObjectSchema),
			z.lazy(() => TagUncheckedCreateWithoutTaggingsInputObjectSchema),
		]),
	})
	.strict();

export const TagCreateOrConnectWithoutTaggingsInputObjectSchema = Schema;
