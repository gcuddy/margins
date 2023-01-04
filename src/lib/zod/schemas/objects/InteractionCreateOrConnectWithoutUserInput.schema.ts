import { z } from 'zod';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';
import { InteractionCreateWithoutUserInputObjectSchema } from './InteractionCreateWithoutUserInput.schema';
import { InteractionUncheckedCreateWithoutUserInputObjectSchema } from './InteractionUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => InteractionWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => InteractionCreateWithoutUserInputObjectSchema),
			z.lazy(() => InteractionUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const InteractionCreateOrConnectWithoutUserInputObjectSchema = Schema;
