import { z } from 'zod';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';
import { StateCreateWithoutBookmarksInputObjectSchema } from './StateCreateWithoutBookmarksInput.schema';
import { StateUncheckedCreateWithoutBookmarksInputObjectSchema } from './StateUncheckedCreateWithoutBookmarksInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateCreateOrConnectWithoutBookmarksInput> = z
	.object({
		where: z.lazy(() => StateWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => StateCreateWithoutBookmarksInputObjectSchema),
			z.lazy(() => StateUncheckedCreateWithoutBookmarksInputObjectSchema),
		]),
	})
	.strict();

export const StateCreateOrConnectWithoutBookmarksInputObjectSchema = Schema;
