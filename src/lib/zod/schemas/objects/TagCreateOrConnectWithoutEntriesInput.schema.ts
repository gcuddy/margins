import { z } from 'zod';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagCreateWithoutEntriesInputObjectSchema } from './TagCreateWithoutEntriesInput.schema';
import { TagUncheckedCreateWithoutEntriesInputObjectSchema } from './TagUncheckedCreateWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateOrConnectWithoutEntriesInput> = z
	.object({
		where: z.lazy(() => TagWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => TagCreateWithoutEntriesInputObjectSchema),
			z.lazy(() => TagUncheckedCreateWithoutEntriesInputObjectSchema),
		]),
	})
	.strict();

export const TagCreateOrConnectWithoutEntriesInputObjectSchema = Schema;
