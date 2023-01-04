import { z } from 'zod';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithoutBookmarkInputObjectSchema } from './TaggingUpdateWithoutBookmarkInput.schema';
import { TaggingUncheckedUpdateWithoutBookmarkInputObjectSchema } from './TaggingUncheckedUpdateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateWithWhereUniqueWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => TaggingWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => TaggingUpdateWithoutBookmarkInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema = Schema;
