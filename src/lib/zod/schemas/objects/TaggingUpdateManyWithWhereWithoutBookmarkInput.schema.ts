import { z } from 'zod';
import { TaggingScalarWhereInputObjectSchema } from './TaggingScalarWhereInput.schema';
import { TaggingUpdateManyMutationInputObjectSchema } from './TaggingUpdateManyMutationInput.schema';
import { TaggingUncheckedUpdateManyWithoutTagsInputObjectSchema } from './TaggingUncheckedUpdateManyWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateManyWithWhereWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => TaggingScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => TaggingUpdateManyMutationInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateManyWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpdateManyWithWhereWithoutBookmarkInputObjectSchema = Schema;
