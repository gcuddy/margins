import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextUpdateWithoutFeedInputObjectSchema } from './ContextUpdateWithoutFeedInput.schema';
import { ContextUncheckedUpdateWithoutFeedInputObjectSchema } from './ContextUncheckedUpdateWithoutFeedInput.schema';
import { ContextCreateWithoutFeedInputObjectSchema } from './ContextCreateWithoutFeedInput.schema';
import { ContextUncheckedCreateWithoutFeedInputObjectSchema } from './ContextUncheckedCreateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpsertWithWhereUniqueWithoutFeedInput> = z
	.object({
		where: z.lazy(() => ContextWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => ContextUpdateWithoutFeedInputObjectSchema),
			z.lazy(() => ContextUncheckedUpdateWithoutFeedInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => ContextCreateWithoutFeedInputObjectSchema),
			z.lazy(() => ContextUncheckedCreateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const ContextUpsertWithWhereUniqueWithoutFeedInputObjectSchema = Schema;
