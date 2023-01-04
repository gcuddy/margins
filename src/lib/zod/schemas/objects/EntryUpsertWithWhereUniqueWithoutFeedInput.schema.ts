import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateWithoutFeedInputObjectSchema } from './EntryUpdateWithoutFeedInput.schema';
import { EntryUncheckedUpdateWithoutFeedInputObjectSchema } from './EntryUncheckedUpdateWithoutFeedInput.schema';
import { EntryCreateWithoutFeedInputObjectSchema } from './EntryCreateWithoutFeedInput.schema';
import { EntryUncheckedCreateWithoutFeedInputObjectSchema } from './EntryUncheckedCreateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpsertWithWhereUniqueWithoutFeedInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => EntryUpdateWithoutFeedInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutFeedInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryCreateWithoutFeedInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpsertWithWhereUniqueWithoutFeedInputObjectSchema = Schema;
