import { z } from 'zod';
import { StateCreateWithoutBookmarksInputObjectSchema } from './StateCreateWithoutBookmarksInput.schema';
import { StateUncheckedCreateWithoutBookmarksInputObjectSchema } from './StateUncheckedCreateWithoutBookmarksInput.schema';
import { StateCreateOrConnectWithoutBookmarksInputObjectSchema } from './StateCreateOrConnectWithoutBookmarksInput.schema';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateCreateNestedOneWithoutBookmarksInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => StateCreateWithoutBookmarksInputObjectSchema),
				z.lazy(() => StateUncheckedCreateWithoutBookmarksInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => StateCreateOrConnectWithoutBookmarksInputObjectSchema).optional(),
		connect: z.lazy(() => StateWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const StateCreateNestedOneWithoutBookmarksInputObjectSchema = Schema;
