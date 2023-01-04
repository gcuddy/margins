import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextUpdateWithoutFeedInputObjectSchema } from './ContextUpdateWithoutFeedInput.schema';
import { ContextUncheckedUpdateWithoutFeedInputObjectSchema } from './ContextUncheckedUpdateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpdateWithWhereUniqueWithoutFeedInput> = z
	.object({
		where: z.lazy(() => ContextWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => ContextUpdateWithoutFeedInputObjectSchema),
			z.lazy(() => ContextUncheckedUpdateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const ContextUpdateWithWhereUniqueWithoutFeedInputObjectSchema = Schema;
