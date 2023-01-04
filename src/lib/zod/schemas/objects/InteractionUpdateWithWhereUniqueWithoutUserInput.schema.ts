import { z } from 'zod';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';
import { InteractionUpdateWithoutUserInputObjectSchema } from './InteractionUpdateWithoutUserInput.schema';
import { InteractionUncheckedUpdateWithoutUserInputObjectSchema } from './InteractionUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => InteractionWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => InteractionUpdateWithoutUserInputObjectSchema),
			z.lazy(() => InteractionUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const InteractionUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
