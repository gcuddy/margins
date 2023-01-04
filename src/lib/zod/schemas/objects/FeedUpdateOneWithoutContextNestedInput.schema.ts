import { z } from 'zod';
import { FeedCreateWithoutContextInputObjectSchema } from './FeedCreateWithoutContextInput.schema';
import { FeedUncheckedCreateWithoutContextInputObjectSchema } from './FeedUncheckedCreateWithoutContextInput.schema';
import { FeedCreateOrConnectWithoutContextInputObjectSchema } from './FeedCreateOrConnectWithoutContextInput.schema';
import { FeedUpsertWithoutContextInputObjectSchema } from './FeedUpsertWithoutContextInput.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';
import { FeedUpdateToOneWithWhereWithoutContextInputObjectSchema } from './FeedUpdateToOneWithWhereWithoutContextInput.schema';
import { FeedUpdateWithoutContextInputObjectSchema } from './FeedUpdateWithoutContextInput.schema';
import { FeedUncheckedUpdateWithoutContextInputObjectSchema } from './FeedUncheckedUpdateWithoutContextInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpdateOneWithoutContextNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FeedCreateWithoutContextInputObjectSchema),
				z.lazy(() => FeedUncheckedCreateWithoutContextInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutContextInputObjectSchema).optional(),
		upsert: z.lazy(() => FeedUpsertWithoutContextInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => FeedWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => FeedWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => FeedWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FeedUpdateToOneWithWhereWithoutContextInputObjectSchema),
				z.lazy(() => FeedUpdateWithoutContextInputObjectSchema),
				z.lazy(() => FeedUncheckedUpdateWithoutContextInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FeedUpdateOneWithoutContextNestedInputObjectSchema = Schema;
