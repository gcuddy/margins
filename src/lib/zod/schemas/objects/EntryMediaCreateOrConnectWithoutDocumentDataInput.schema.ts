import { z } from 'zod';
import { EntryMediaWhereUniqueInputObjectSchema } from './EntryMediaWhereUniqueInput.schema';
import { EntryMediaCreateWithoutDocumentDataInputObjectSchema } from './EntryMediaCreateWithoutDocumentDataInput.schema';
import { EntryMediaUncheckedCreateWithoutDocumentDataInputObjectSchema } from './EntryMediaUncheckedCreateWithoutDocumentDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaCreateOrConnectWithoutDocumentDataInput> = z
	.object({
		where: z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryMediaCreateWithoutDocumentDataInputObjectSchema),
			z.lazy(() => EntryMediaUncheckedCreateWithoutDocumentDataInputObjectSchema),
		]),
	})
	.strict();

export const EntryMediaCreateOrConnectWithoutDocumentDataInputObjectSchema = Schema;
