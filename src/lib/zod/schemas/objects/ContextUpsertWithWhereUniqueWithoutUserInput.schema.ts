import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextUpdateWithoutUserInputObjectSchema } from './ContextUpdateWithoutUserInput.schema';
import { ContextUncheckedUpdateWithoutUserInputObjectSchema } from './ContextUncheckedUpdateWithoutUserInput.schema';
import { ContextCreateWithoutUserInputObjectSchema } from './ContextCreateWithoutUserInput.schema';
import { ContextUncheckedCreateWithoutUserInputObjectSchema } from './ContextUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => ContextWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => ContextUpdateWithoutUserInputObjectSchema),
			z.lazy(() => ContextUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => ContextCreateWithoutUserInputObjectSchema),
			z.lazy(() => ContextUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const ContextUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
