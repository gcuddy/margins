import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithoutBookmarkInputObjectSchema } from './TaggingUpdateWithoutBookmarkInput.schema';
import { TaggingUncheckedUpdateWithoutBookmarkInputObjectSchema } from './TaggingUncheckedUpdateWithoutBookmarkInput.schema';
import { TaggingCreateWithoutBookmarkInputObjectSchema } from './TaggingCreateWithoutBookmarkInput.schema';
import { TaggingUncheckedCreateWithoutBookmarkInputObjectSchema } from './TaggingUncheckedCreateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpsertWithWhereUniqueWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => TaggingUpdateWithoutBookmarkInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateWithoutBookmarkInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => TaggingCreateWithoutBookmarkInputObjectSchema),
			z.lazy(() => TaggingUncheckedCreateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema = Schema;
