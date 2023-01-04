import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextUpdateWithoutEntryInputObjectSchema } from './ContextUpdateWithoutEntryInput.schema';
import { ContextUncheckedUpdateWithoutEntryInputObjectSchema } from './ContextUncheckedUpdateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpdateWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => ContextWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => ContextUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => ContextUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const ContextUpdateWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
