import { z } from 'zod';
import { FeedCreateWithoutEntriesInputObjectSchema } from './FeedCreateWithoutEntriesInput.schema';
import { FeedUncheckedCreateWithoutEntriesInputObjectSchema } from './FeedUncheckedCreateWithoutEntriesInput.schema';
import { FeedCreateOrConnectWithoutEntriesInputObjectSchema } from './FeedCreateOrConnectWithoutEntriesInput.schema';
import { FeedUpsertWithoutEntriesInputObjectSchema } from './FeedUpsertWithoutEntriesInput.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';
import { FeedUpdateToOneWithWhereWithoutEntriesInputObjectSchema } from './FeedUpdateToOneWithWhereWithoutEntriesInput.schema';
import { FeedUpdateWithoutEntriesInputObjectSchema } from './FeedUpdateWithoutEntriesInput.schema';
import { FeedUncheckedUpdateWithoutEntriesInputObjectSchema } from './FeedUncheckedUpdateWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpdateOneWithoutEntriesNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FeedCreateWithoutEntriesInputObjectSchema),
				z.lazy(() => FeedUncheckedCreateWithoutEntriesInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutEntriesInputObjectSchema).optional(),
		upsert: z.lazy(() => FeedUpsertWithoutEntriesInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => FeedWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => FeedWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => FeedWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FeedUpdateToOneWithWhereWithoutEntriesInputObjectSchema),
				z.lazy(() => FeedUpdateWithoutEntriesInputObjectSchema),
				z.lazy(() => FeedUncheckedUpdateWithoutEntriesInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FeedUpdateOneWithoutEntriesNestedInputObjectSchema = Schema;
