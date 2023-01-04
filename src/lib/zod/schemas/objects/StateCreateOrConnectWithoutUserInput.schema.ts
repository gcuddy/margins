import { z } from 'zod';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';
import { StateCreateWithoutUserInputObjectSchema } from './StateCreateWithoutUserInput.schema';
import { StateUncheckedCreateWithoutUserInputObjectSchema } from './StateUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => StateWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => StateCreateWithoutUserInputObjectSchema),
			z.lazy(() => StateUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const StateCreateOrConnectWithoutUserInputObjectSchema = Schema;
