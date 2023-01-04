import { z } from 'zod';
import { EntryMediaWhereUniqueInputObjectSchema } from './EntryMediaWhereUniqueInput.schema';
import { EntryMediaUpdateWithoutDocumentDataInputObjectSchema } from './EntryMediaUpdateWithoutDocumentDataInput.schema';
import { EntryMediaUncheckedUpdateWithoutDocumentDataInputObjectSchema } from './EntryMediaUncheckedUpdateWithoutDocumentDataInput.schema';
import { EntryMediaCreateWithoutDocumentDataInputObjectSchema } from './EntryMediaCreateWithoutDocumentDataInput.schema';
import { EntryMediaUncheckedCreateWithoutDocumentDataInputObjectSchema } from './EntryMediaUncheckedCreateWithoutDocumentDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaUpsertWithWhereUniqueWithoutDocumentDataInput> = z
	.object({
		where: z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => EntryMediaUpdateWithoutDocumentDataInputObjectSchema),
			z.lazy(() => EntryMediaUncheckedUpdateWithoutDocumentDataInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => EntryMediaCreateWithoutDocumentDataInputObjectSchema),
			z.lazy(() => EntryMediaUncheckedCreateWithoutDocumentDataInputObjectSchema),
		]),
	})
	.strict();

export const EntryMediaUpsertWithWhereUniqueWithoutDocumentDataInputObjectSchema = Schema;
