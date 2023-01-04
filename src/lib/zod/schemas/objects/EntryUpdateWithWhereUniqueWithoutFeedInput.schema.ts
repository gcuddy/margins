import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateWithoutFeedInputObjectSchema } from './EntryUpdateWithoutFeedInput.schema';
import { EntryUncheckedUpdateWithoutFeedInputObjectSchema } from './EntryUncheckedUpdateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUpdateWithWhereUniqueWithoutFeedInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryUpdateWithoutFeedInputObjectSchema),
			z.lazy(() => EntryUncheckedUpdateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const EntryUpdateWithWhereUniqueWithoutFeedInputObjectSchema = Schema;
