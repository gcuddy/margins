import { z } from 'zod';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';
import { InteractionUpdateWithoutEntryInputObjectSchema } from './InteractionUpdateWithoutEntryInput.schema';
import { InteractionUncheckedUpdateWithoutEntryInputObjectSchema } from './InteractionUncheckedUpdateWithoutEntryInput.schema';
import { InteractionCreateWithoutEntryInputObjectSchema } from './InteractionCreateWithoutEntryInput.schema';
import { InteractionUncheckedCreateWithoutEntryInputObjectSchema } from './InteractionUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUpsertWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => InteractionWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => InteractionUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => InteractionUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => InteractionCreateWithoutEntryInputObjectSchema),
			z.lazy(() => InteractionUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const InteractionUpsertWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
