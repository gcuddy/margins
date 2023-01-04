import { z } from 'zod';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';
import { StateUpdateWithoutUserInputObjectSchema } from './StateUpdateWithoutUserInput.schema';
import { StateUncheckedUpdateWithoutUserInputObjectSchema } from './StateUncheckedUpdateWithoutUserInput.schema';
import { StateCreateWithoutUserInputObjectSchema } from './StateCreateWithoutUserInput.schema';
import { StateUncheckedCreateWithoutUserInputObjectSchema } from './StateUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => StateWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => StateUpdateWithoutUserInputObjectSchema),
			z.lazy(() => StateUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => StateCreateWithoutUserInputObjectSchema),
			z.lazy(() => StateUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const StateUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
