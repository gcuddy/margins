import { z } from 'zod';
import { InteractionWhereInputObjectSchema } from './InteractionWhereInput.schema';
import { InteractionUpdateWithoutBookmarkInputObjectSchema } from './InteractionUpdateWithoutBookmarkInput.schema';
import { InteractionUncheckedUpdateWithoutBookmarkInputObjectSchema } from './InteractionUncheckedUpdateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUpdateToOneWithWhereWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => InteractionWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => InteractionUpdateWithoutBookmarkInputObjectSchema),
			z.lazy(() => InteractionUncheckedUpdateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const InteractionUpdateToOneWithWhereWithoutBookmarkInputObjectSchema = Schema;
