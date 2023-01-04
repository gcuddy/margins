import { z } from 'zod';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';
import { InteractionUpdateWithoutEntryInputObjectSchema } from './InteractionUpdateWithoutEntryInput.schema';
import { InteractionUncheckedUpdateWithoutEntryInputObjectSchema } from './InteractionUncheckedUpdateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUpdateWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => InteractionWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => InteractionUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => InteractionUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const InteractionUpdateWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
