import { z } from 'zod';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryCreateWithoutBookmarksInputObjectSchema } from './EntryCreateWithoutBookmarksInput.schema';
import { EntryUncheckedCreateWithoutBookmarksInputObjectSchema } from './EntryUncheckedCreateWithoutBookmarksInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateOrConnectWithoutBookmarksInput> = z
	.object({
		where: z.lazy(() => EntryWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => EntryCreateWithoutBookmarksInputObjectSchema),
			z.lazy(() => EntryUncheckedCreateWithoutBookmarksInputObjectSchema),
		]),
	})
	.strict();

export const EntryCreateOrConnectWithoutBookmarksInputObjectSchema = Schema;
