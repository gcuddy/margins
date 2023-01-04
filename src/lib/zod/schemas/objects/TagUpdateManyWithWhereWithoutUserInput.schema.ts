import { z } from 'zod';
import { TagScalarWhereInputObjectSchema } from './TagScalarWhereInput.schema';
import { TagUpdateManyMutationInputObjectSchema } from './TagUpdateManyMutationInput.schema';
import { TagUncheckedUpdateManyWithoutTagsInputObjectSchema } from './TagUncheckedUpdateManyWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpdateManyWithWhereWithoutUserInput> = z
	.object({
		where: z.lazy(() => TagScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => TagUpdateManyMutationInputObjectSchema),
			z.lazy(() => TagUncheckedUpdateManyWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const TagUpdateManyWithWhereWithoutUserInputObjectSchema = Schema;
