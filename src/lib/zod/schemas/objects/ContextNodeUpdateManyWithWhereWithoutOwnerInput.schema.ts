import { z } from 'zod';
import { ContextNodeScalarWhereInputObjectSchema } from './ContextNodeScalarWhereInput.schema';
import { ContextNodeUpdateManyMutationInputObjectSchema } from './ContextNodeUpdateManyMutationInput.schema';
import { ContextNodeUncheckedUpdateManyWithoutContext_nodesInputObjectSchema } from './ContextNodeUncheckedUpdateManyWithoutContext_nodesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeUpdateManyWithWhereWithoutOwnerInput> = z
	.object({
		where: z.lazy(() => ContextNodeScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => ContextNodeUpdateManyMutationInputObjectSchema),
			z.lazy(() => ContextNodeUncheckedUpdateManyWithoutContext_nodesInputObjectSchema),
		]),
	})
	.strict();

export const ContextNodeUpdateManyWithWhereWithoutOwnerInputObjectSchema = Schema;
