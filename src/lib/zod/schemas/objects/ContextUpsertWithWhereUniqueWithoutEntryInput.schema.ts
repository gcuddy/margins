import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextUpdateWithoutEntryInputObjectSchema } from './ContextUpdateWithoutEntryInput.schema';
import { ContextUncheckedUpdateWithoutEntryInputObjectSchema } from './ContextUncheckedUpdateWithoutEntryInput.schema';
import { ContextCreateWithoutEntryInputObjectSchema } from './ContextCreateWithoutEntryInput.schema';
import { ContextUncheckedCreateWithoutEntryInputObjectSchema } from './ContextUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpsertWithWhereUniqueWithoutEntryInput> = z
	.object({
		where: z.lazy(() => ContextWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => ContextUpdateWithoutEntryInputObjectSchema),
			z.lazy(() => ContextUncheckedUpdateWithoutEntryInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => ContextCreateWithoutEntryInputObjectSchema),
			z.lazy(() => ContextUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const ContextUpsertWithWhereUniqueWithoutEntryInputObjectSchema = Schema;
