import { z } from 'zod';
import { InteractionScalarWhereInputObjectSchema } from './InteractionScalarWhereInput.schema';
import { InteractionUpdateManyMutationInputObjectSchema } from './InteractionUpdateManyMutationInput.schema';
import { InteractionUncheckedUpdateManyWithoutInteractionsInputObjectSchema } from './InteractionUncheckedUpdateManyWithoutInteractionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUpdateManyWithWhereWithoutUserInput> = z
	.object({
		where: z.lazy(() => InteractionScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => InteractionUpdateManyMutationInputObjectSchema),
			z.lazy(() => InteractionUncheckedUpdateManyWithoutInteractionsInputObjectSchema),
		]),
	})
	.strict();

export const InteractionUpdateManyWithWhereWithoutUserInputObjectSchema = Schema;
