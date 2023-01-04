import { z } from 'zod';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';
import { InteractionCreateWithoutBookmarkInputObjectSchema } from './InteractionCreateWithoutBookmarkInput.schema';
import { InteractionUncheckedCreateWithoutBookmarkInputObjectSchema } from './InteractionUncheckedCreateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionCreateOrConnectWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => InteractionWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => InteractionCreateWithoutBookmarkInputObjectSchema),
			z.lazy(() => InteractionUncheckedCreateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const InteractionCreateOrConnectWithoutBookmarkInputObjectSchema = Schema;
