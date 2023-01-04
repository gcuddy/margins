import { z } from 'zod';
import { StateCreateWithoutBookmarksInputObjectSchema } from './StateCreateWithoutBookmarksInput.schema';
import { StateUncheckedCreateWithoutBookmarksInputObjectSchema } from './StateUncheckedCreateWithoutBookmarksInput.schema';
import { StateCreateOrConnectWithoutBookmarksInputObjectSchema } from './StateCreateOrConnectWithoutBookmarksInput.schema';
import { StateUpsertWithoutBookmarksInputObjectSchema } from './StateUpsertWithoutBookmarksInput.schema';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';
import { StateUpdateToOneWithWhereWithoutBookmarksInputObjectSchema } from './StateUpdateToOneWithWhereWithoutBookmarksInput.schema';
import { StateUpdateWithoutBookmarksInputObjectSchema } from './StateUpdateWithoutBookmarksInput.schema';
import { StateUncheckedUpdateWithoutBookmarksInputObjectSchema } from './StateUncheckedUpdateWithoutBookmarksInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpdateOneWithoutBookmarksNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => StateCreateWithoutBookmarksInputObjectSchema),
				z.lazy(() => StateUncheckedCreateWithoutBookmarksInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => StateCreateOrConnectWithoutBookmarksInputObjectSchema).optional(),
		upsert: z.lazy(() => StateUpsertWithoutBookmarksInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => StateWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => StateWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => StateWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => StateUpdateToOneWithWhereWithoutBookmarksInputObjectSchema),
				z.lazy(() => StateUpdateWithoutBookmarksInputObjectSchema),
				z.lazy(() => StateUncheckedUpdateWithoutBookmarksInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const StateUpdateOneWithoutBookmarksNestedInputObjectSchema = Schema;
