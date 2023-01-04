import { z } from 'zod';
import { EntryMediaScalarWhereInputObjectSchema } from './EntryMediaScalarWhereInput.schema';
import { EntryMediaUpdateManyMutationInputObjectSchema } from './EntryMediaUpdateManyMutationInput.schema';
import { EntryMediaUncheckedUpdateManyWithoutMediaInputObjectSchema } from './EntryMediaUncheckedUpdateManyWithoutMediaInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaUpdateManyWithWhereWithoutDocumentDataInput> = z
	.object({
		where: z.lazy(() => EntryMediaScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => EntryMediaUpdateManyMutationInputObjectSchema),
			z.lazy(() => EntryMediaUncheckedUpdateManyWithoutMediaInputObjectSchema),
		]),
	})
	.strict();

export const EntryMediaUpdateManyWithWhereWithoutDocumentDataInputObjectSchema = Schema;
