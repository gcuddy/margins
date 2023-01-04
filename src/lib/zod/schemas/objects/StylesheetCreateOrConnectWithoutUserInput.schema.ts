import { z } from 'zod';
import { StylesheetWhereUniqueInputObjectSchema } from './StylesheetWhereUniqueInput.schema';
import { StylesheetCreateWithoutUserInputObjectSchema } from './StylesheetCreateWithoutUserInput.schema';
import { StylesheetUncheckedCreateWithoutUserInputObjectSchema } from './StylesheetUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => StylesheetCreateWithoutUserInputObjectSchema),
			z.lazy(() => StylesheetUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const StylesheetCreateOrConnectWithoutUserInputObjectSchema = Schema;
