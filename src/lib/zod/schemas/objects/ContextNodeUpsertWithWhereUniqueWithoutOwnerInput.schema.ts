import { z } from 'zod';
import { ContextNodeWhereUniqueInputObjectSchema } from './ContextNodeWhereUniqueInput.schema';
import { ContextNodeUpdateWithoutOwnerInputObjectSchema } from './ContextNodeUpdateWithoutOwnerInput.schema';
import { ContextNodeUncheckedUpdateWithoutOwnerInputObjectSchema } from './ContextNodeUncheckedUpdateWithoutOwnerInput.schema';
import { ContextNodeCreateWithoutOwnerInputObjectSchema } from './ContextNodeCreateWithoutOwnerInput.schema';
import { ContextNodeUncheckedCreateWithoutOwnerInputObjectSchema } from './ContextNodeUncheckedCreateWithoutOwnerInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeUpsertWithWhereUniqueWithoutOwnerInput> = z
	.object({
		where: z.lazy(() => ContextNodeWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => ContextNodeUpdateWithoutOwnerInputObjectSchema),
			z.lazy(() => ContextNodeUncheckedUpdateWithoutOwnerInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => ContextNodeCreateWithoutOwnerInputObjectSchema),
			z.lazy(() => ContextNodeUncheckedCreateWithoutOwnerInputObjectSchema),
		]),
	})
	.strict();

export const ContextNodeUpsertWithWhereUniqueWithoutOwnerInputObjectSchema = Schema;
