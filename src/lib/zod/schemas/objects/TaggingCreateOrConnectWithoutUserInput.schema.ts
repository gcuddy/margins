import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingCreateWithoutUserInputObjectSchema } from './TaggingCreateWithoutUserInput.schema';
import { TaggingUncheckedCreateWithoutUserInputObjectSchema } from './TaggingUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => TaggingCreateWithoutUserInputObjectSchema),
			z.lazy(() => TaggingUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const TaggingCreateOrConnectWithoutUserInputObjectSchema = Schema;
