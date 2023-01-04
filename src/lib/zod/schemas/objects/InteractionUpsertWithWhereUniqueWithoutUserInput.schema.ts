import { z } from 'zod';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';
import { InteractionUpdateWithoutUserInputObjectSchema } from './InteractionUpdateWithoutUserInput.schema';
import { InteractionUncheckedUpdateWithoutUserInputObjectSchema } from './InteractionUncheckedUpdateWithoutUserInput.schema';
import { InteractionCreateWithoutUserInputObjectSchema } from './InteractionCreateWithoutUserInput.schema';
import { InteractionUncheckedCreateWithoutUserInputObjectSchema } from './InteractionUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => InteractionWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => InteractionUpdateWithoutUserInputObjectSchema),
			z.lazy(() => InteractionUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => InteractionCreateWithoutUserInputObjectSchema),
			z.lazy(() => InteractionUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const InteractionUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
