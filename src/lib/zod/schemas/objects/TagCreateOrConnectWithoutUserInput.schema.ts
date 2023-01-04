import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagCreateWithoutUserInputObjectSchema } from './TagCreateWithoutUserInput.schema';
import { TagUncheckedCreateWithoutUserInputObjectSchema } from './TagUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => TagWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => TagCreateWithoutUserInputObjectSchema),
			z.lazy(() => TagUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const TagCreateOrConnectWithoutUserInputObjectSchema = Schema;
