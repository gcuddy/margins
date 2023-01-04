import { z } from 'zod';
import { InteractionUpdateWithoutBookmarkInputObjectSchema } from './InteractionUpdateWithoutBookmarkInput.schema';
import { InteractionUncheckedUpdateWithoutBookmarkInputObjectSchema } from './InteractionUncheckedUpdateWithoutBookmarkInput.schema';
import { InteractionCreateWithoutBookmarkInputObjectSchema } from './InteractionCreateWithoutBookmarkInput.schema';
import { InteractionUncheckedCreateWithoutBookmarkInputObjectSchema } from './InteractionUncheckedCreateWithoutBookmarkInput.schema';
import { InteractionWhereInputObjectSchema } from './InteractionWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUpsertWithoutBookmarkInput> = z
	.object({
		update: z.union([
			z.lazy(() => InteractionUpdateWithoutBookmarkInputObjectSchema),
			z.lazy(() => InteractionUncheckedUpdateWithoutBookmarkInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => InteractionCreateWithoutBookmarkInputObjectSchema),
			z.lazy(() => InteractionUncheckedCreateWithoutBookmarkInputObjectSchema),
		]),
		where: z.lazy(() => InteractionWhereInputObjectSchema).optional(),
	})
	.strict();

export const InteractionUpsertWithoutBookmarkInputObjectSchema = Schema;
