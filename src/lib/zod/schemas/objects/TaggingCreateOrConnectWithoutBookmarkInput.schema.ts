import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingCreateWithoutBookmarkInputObjectSchema } from './TaggingCreateWithoutBookmarkInput.schema';
import { TaggingUncheckedCreateWithoutBookmarkInputObjectSchema } from './TaggingUncheckedCreateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateOrConnectWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => TaggingCreateWithoutBookmarkInputObjectSchema),
			z.lazy(() => TaggingUncheckedCreateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const TaggingCreateOrConnectWithoutBookmarkInputObjectSchema = Schema;
