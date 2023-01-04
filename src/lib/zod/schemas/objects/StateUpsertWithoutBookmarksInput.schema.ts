import { z } from 'zod';
import { StateUpdateWithoutBookmarksInputObjectSchema } from './StateUpdateWithoutBookmarksInput.schema';
import { StateUncheckedUpdateWithoutBookmarksInputObjectSchema } from './StateUncheckedUpdateWithoutBookmarksInput.schema';
import { StateCreateWithoutBookmarksInputObjectSchema } from './StateCreateWithoutBookmarksInput.schema';
import { StateUncheckedCreateWithoutBookmarksInputObjectSchema } from './StateUncheckedCreateWithoutBookmarksInput.schema';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpsertWithoutBookmarksInput> = z
	.object({
		update: z.union([
			z.lazy(() => StateUpdateWithoutBookmarksInputObjectSchema),
			z.lazy(() => StateUncheckedUpdateWithoutBookmarksInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => StateCreateWithoutBookmarksInputObjectSchema),
			z.lazy(() => StateUncheckedCreateWithoutBookmarksInputObjectSchema),
		]),
		where: z.lazy(() => StateWhereInputObjectSchema).optional(),
	})
	.strict();

export const StateUpsertWithoutBookmarksInputObjectSchema = Schema;
