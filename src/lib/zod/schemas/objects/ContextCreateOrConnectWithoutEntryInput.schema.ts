import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextCreateWithoutEntryInputObjectSchema } from './ContextCreateWithoutEntryInput.schema';
import { ContextUncheckedCreateWithoutEntryInputObjectSchema } from './ContextUncheckedCreateWithoutEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCreateOrConnectWithoutEntryInput> = z
	.object({
		where: z.lazy(() => ContextWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => ContextCreateWithoutEntryInputObjectSchema),
			z.lazy(() => ContextUncheckedCreateWithoutEntryInputObjectSchema),
		]),
	})
	.strict();

export const ContextCreateOrConnectWithoutEntryInputObjectSchema = Schema;
