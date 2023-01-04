import { z } from 'zod';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';
import { StateUpdateWithoutUserInputObjectSchema } from './StateUpdateWithoutUserInput.schema';
import { StateUncheckedUpdateWithoutUserInputObjectSchema } from './StateUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => StateWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => StateUpdateWithoutUserInputObjectSchema),
			z.lazy(() => StateUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const StateUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
