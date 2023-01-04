import { z } from 'zod';
import { ContextNodeWhereUniqueInputObjectSchema } from './ContextNodeWhereUniqueInput.schema';
import { ContextNodeUpdateWithoutOwnerInputObjectSchema } from './ContextNodeUpdateWithoutOwnerInput.schema';
import { ContextNodeUncheckedUpdateWithoutOwnerInputObjectSchema } from './ContextNodeUncheckedUpdateWithoutOwnerInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeUpdateWithWhereUniqueWithoutOwnerInput> = z
	.object({
		where: z.lazy(() => ContextNodeWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => ContextNodeUpdateWithoutOwnerInputObjectSchema),
			z.lazy(() => ContextNodeUncheckedUpdateWithoutOwnerInputObjectSchema),
		]),
	})
	.strict();

export const ContextNodeUpdateWithWhereUniqueWithoutOwnerInputObjectSchema = Schema;
