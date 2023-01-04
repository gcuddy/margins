import { z } from 'zod';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';
import { StateUpdateWithoutBookmarksInputObjectSchema } from './StateUpdateWithoutBookmarksInput.schema';
import { StateUncheckedUpdateWithoutBookmarksInputObjectSchema } from './StateUncheckedUpdateWithoutBookmarksInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpdateToOneWithWhereWithoutBookmarksInput> = z
	.object({
		where: z.lazy(() => StateWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => StateUpdateWithoutBookmarksInputObjectSchema),
			z.lazy(() => StateUncheckedUpdateWithoutBookmarksInputObjectSchema),
		]),
	})
	.strict();

export const StateUpdateToOneWithWhereWithoutBookmarksInputObjectSchema = Schema;
