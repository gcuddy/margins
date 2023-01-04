import { z } from 'zod';
import { SessionWhereUniqueInputObjectSchema } from './SessionWhereUniqueInput.schema';
import { SessionUpdateWithoutUserInputObjectSchema } from './SessionUpdateWithoutUserInput.schema';
import { SessionUncheckedUpdateWithoutUserInputObjectSchema } from './SessionUncheckedUpdateWithoutUserInput.schema';
import { SessionCreateWithoutUserInputObjectSchema } from './SessionCreateWithoutUserInput.schema';
import { SessionUncheckedCreateWithoutUserInputObjectSchema } from './SessionUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => SessionWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => SessionUpdateWithoutUserInputObjectSchema),
			z.lazy(() => SessionUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => SessionCreateWithoutUserInputObjectSchema),
			z.lazy(() => SessionUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
