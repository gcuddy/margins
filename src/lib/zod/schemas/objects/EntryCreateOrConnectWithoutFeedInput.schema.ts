import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryCreateWithoutFeedInputObjectSchema } from './EntryCreateWithoutFeedInput.schema';
import { EntryUncheckedCreateWithoutFeedInputObjectSchema } from './EntryUncheckedCreateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateOrConnectWithoutFeedInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryCreateWithoutFeedInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const EntryCreateOrConnectWithoutFeedInputObjectSchema = Schema;
