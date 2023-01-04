import { z } from 'zod';
import { InteractionCreateWithoutBookmarkInputObjectSchema } from './InteractionCreateWithoutBookmarkInput.schema';
import { InteractionUncheckedCreateWithoutBookmarkInputObjectSchema } from './InteractionUncheckedCreateWithoutBookmarkInput.schema';
import { InteractionCreateOrConnectWithoutBookmarkInputObjectSchema } from './InteractionCreateOrConnectWithoutBookmarkInput.schema';
import { InteractionUpsertWithoutBookmarkInputObjectSchema } from './InteractionUpsertWithoutBookmarkInput.schema';
import { InteractionWhereInputObjectSchema } from './InteractionWhereInput.schema';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';
import { InteractionUpdateToOneWithWhereWithoutBookmarkInputObjectSchema } from './InteractionUpdateToOneWithWhereWithoutBookmarkInput.schema';
import { InteractionUpdateWithoutBookmarkInputObjectSchema } from './InteractionUpdateWithoutBookmarkInput.schema';
import { InteractionUncheckedUpdateWithoutBookmarkInputObjectSchema } from './InteractionUncheckedUpdateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUpdateOneWithoutBookmarkNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => InteractionCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => InteractionUncheckedCreateWithoutBookmarkInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => InteractionCreateOrConnectWithoutBookmarkInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => InteractionUpsertWithoutBookmarkInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => InteractionWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => InteractionWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => InteractionWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => InteractionUpdateToOneWithWhereWithoutBookmarkInputObjectSchema),
				z.lazy(() => InteractionUpdateWithoutBookmarkInputObjectSchema),
				z.lazy(() => InteractionUncheckedUpdateWithoutBookmarkInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const InteractionUpdateOneWithoutBookmarkNestedInputObjectSchema = Schema;
