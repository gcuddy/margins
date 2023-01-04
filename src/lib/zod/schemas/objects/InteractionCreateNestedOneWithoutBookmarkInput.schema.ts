import { z } from 'zod';
import { InteractionCreateWithoutBookmarkInputObjectSchema } from './InteractionCreateWithoutBookmarkInput.schema';
import { InteractionUncheckedCreateWithoutBookmarkInputObjectSchema } from './InteractionUncheckedCreateWithoutBookmarkInput.schema';
import { InteractionCreateOrConnectWithoutBookmarkInputObjectSchema } from './InteractionCreateOrConnectWithoutBookmarkInput.schema';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionCreateNestedOneWithoutBookmarkInput> = z
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
		connect: z.lazy(() => InteractionWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const InteractionCreateNestedOneWithoutBookmarkInputObjectSchema = Schema;
