import { z } from 'zod';
import { FeedCreateWithoutTagsInputObjectSchema } from './FeedCreateWithoutTagsInput.schema';
import { FeedUncheckedCreateWithoutTagsInputObjectSchema } from './FeedUncheckedCreateWithoutTagsInput.schema';
import { FeedCreateOrConnectWithoutTagsInputObjectSchema } from './FeedCreateOrConnectWithoutTagsInput.schema';
import { FeedUpsertWithoutTagsInputObjectSchema } from './FeedUpsertWithoutTagsInput.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';
import { FeedUpdateToOneWithWhereWithoutTagsInputObjectSchema } from './FeedUpdateToOneWithWhereWithoutTagsInput.schema';
import { FeedUpdateWithoutTagsInputObjectSchema } from './FeedUpdateWithoutTagsInput.schema';
import { FeedUncheckedUpdateWithoutTagsInputObjectSchema } from './FeedUncheckedUpdateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpdateOneWithoutTagsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FeedCreateWithoutTagsInputObjectSchema),
				z.lazy(() => FeedUncheckedCreateWithoutTagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutTagsInputObjectSchema).optional(),
		upsert: z.lazy(() => FeedUpsertWithoutTagsInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => FeedWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => FeedWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => FeedWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FeedUpdateToOneWithWhereWithoutTagsInputObjectSchema),
				z.lazy(() => FeedUpdateWithoutTagsInputObjectSchema),
				z.lazy(() => FeedUncheckedUpdateWithoutTagsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FeedUpdateOneWithoutTagsNestedInputObjectSchema = Schema;
