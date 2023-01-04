import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextCreateWithoutFeedInputObjectSchema } from './ContextCreateWithoutFeedInput.schema';
import { ContextUncheckedCreateWithoutFeedInputObjectSchema } from './ContextUncheckedCreateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCreateOrConnectWithoutFeedInput> = z
	.object({
		where: z.lazy(() => ContextWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => ContextCreateWithoutFeedInputObjectSchema),
			z.lazy(() => ContextUncheckedCreateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const ContextCreateOrConnectWithoutFeedInputObjectSchema = Schema;
