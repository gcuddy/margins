import { z } from 'zod';
import { StateScalarWhereInputObjectSchema } from './StateScalarWhereInput.schema';
import { StateUpdateManyMutationInputObjectSchema } from './StateUpdateManyMutationInput.schema';
import { StateUncheckedUpdateManyWithoutStatesInputObjectSchema } from './StateUncheckedUpdateManyWithoutStatesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpdateManyWithWhereWithoutUserInput> = z
	.object({
		where: z.lazy(() => StateScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => StateUpdateManyMutationInputObjectSchema),
			z.lazy(() => StateUncheckedUpdateManyWithoutStatesInputObjectSchema),
		]),
	})
	.strict();

export const StateUpdateManyWithWhereWithoutUserInputObjectSchema = Schema;
