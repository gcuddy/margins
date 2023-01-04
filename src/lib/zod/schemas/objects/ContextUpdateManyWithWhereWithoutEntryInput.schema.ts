import { z } from 'zod';
import { ContextScalarWhereInputObjectSchema } from './ContextScalarWhereInput.schema';
import { ContextUpdateManyMutationInputObjectSchema } from './ContextUpdateManyMutationInput.schema';
import { ContextUncheckedUpdateManyWithoutContextInputObjectSchema } from './ContextUncheckedUpdateManyWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpdateManyWithWhereWithoutEntryInput> = z
	.object({
		where: z.lazy(() => ContextScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => ContextUpdateManyMutationInputObjectSchema),
			z.lazy(() => ContextUncheckedUpdateManyWithoutContextInputObjectSchema),
		]),
	})
	.strict();

export const ContextUpdateManyWithWhereWithoutEntryInputObjectSchema = Schema;
