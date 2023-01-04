import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextUpdateWithoutUserInputObjectSchema } from './ContextUpdateWithoutUserInput.schema';
import { ContextUncheckedUpdateWithoutUserInputObjectSchema } from './ContextUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => ContextWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => ContextUpdateWithoutUserInputObjectSchema),
			z.lazy(() => ContextUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const ContextUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
