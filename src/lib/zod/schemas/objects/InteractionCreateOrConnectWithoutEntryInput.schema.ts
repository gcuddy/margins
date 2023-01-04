import { z } from 'zod';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';
import { InteractionCreateWithoutEntryInputObjectSchema } from './InteractionCreateWithoutEntryInput.schema';
import { InteractionUncheckedCreateWithoutEntryInputObjectSchema } from './InteractionUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionCreateOrConnectWithoutEntryInput> = z
	.object({
		where: z.lazy(() => InteractionWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => InteractionCreateWithoutEntryInputObjectSchema),
			z.lazy(() => InteractionUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const InteractionCreateOrConnectWithoutEntryInputObjectSchema = Schema;
