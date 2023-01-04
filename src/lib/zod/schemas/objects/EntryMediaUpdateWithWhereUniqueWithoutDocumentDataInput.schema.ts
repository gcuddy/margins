import { z } from 'zod';
import { EntryMediaWhereUniqueInputObjectSchema } from './EntryMediaWhereUniqueInput.schema';
import { EntryMediaUpdateWithoutDocumentDataInputObjectSchema } from './EntryMediaUpdateWithoutDocumentDataInput.schema';
import { EntryMediaUncheckedUpdateWithoutDocumentDataInputObjectSchema } from './EntryMediaUncheckedUpdateWithoutDocumentDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaUpdateWithWhereUniqueWithoutDocumentDataInput> = z
	.object({
		where: z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryMediaUpdateWithoutDocumentDataInputObjectSchema),
			z.lazy(() => EntryMediaUncheckedUpdateWithoutDocumentDataInputObjectSchema),
		]),
	})
	.strict();

export const EntryMediaUpdateWithWhereUniqueWithoutDocumentDataInputObjectSchema = Schema;
