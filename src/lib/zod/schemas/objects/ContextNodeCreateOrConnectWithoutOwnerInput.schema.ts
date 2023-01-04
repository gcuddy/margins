import { z } from 'zod';
import { ContextNodeWhereUniqueInputObjectSchema } from './ContextNodeWhereUniqueInput.schema';
import { ContextNodeCreateWithoutOwnerInputObjectSchema } from './ContextNodeCreateWithoutOwnerInput.schema';
import { ContextNodeUncheckedCreateWithoutOwnerInputObjectSchema } from './ContextNodeUncheckedCreateWithoutOwnerInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeCreateOrConnectWithoutOwnerInput> = z
	.object({
		where: z.lazy(() => ContextNodeWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => ContextNodeCreateWithoutOwnerInputObjectSchema),
			z.lazy(() => ContextNodeUncheckedCreateWithoutOwnerInputObjectSchema),
		]),
	})
	.strict();

export const ContextNodeCreateOrConnectWithoutOwnerInputObjectSchema = Schema;
