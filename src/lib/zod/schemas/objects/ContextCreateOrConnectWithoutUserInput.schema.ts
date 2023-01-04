import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextCreateWithoutUserInputObjectSchema } from './ContextCreateWithoutUserInput.schema';
import { ContextUncheckedCreateWithoutUserInputObjectSchema } from './ContextUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => ContextWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => ContextCreateWithoutUserInputObjectSchema),
			z.lazy(() => ContextUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const ContextCreateOrConnectWithoutUserInputObjectSchema = Schema;
