import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingCreateWithoutTagInputObjectSchema } from './TaggingCreateWithoutTagInput.schema';
import { TaggingUncheckedCreateWithoutTagInputObjectSchema } from './TaggingUncheckedCreateWithoutTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateOrConnectWithoutTagInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => TaggingCreateWithoutTagInputObjectSchema),
			z.lazy(() => TaggingUncheckedCreateWithoutTagInputObjectSchema),
		]),
	})
	.strict();

export const TaggingCreateOrConnectWithoutTagInputObjectSchema = Schema;
