import { z } from 'zod';
import { TaggingScalarWhereInputObjectSchema } from './TaggingScalarWhereInput.schema';
import { TaggingUpdateManyMutationInputObjectSchema } from './TaggingUpdateManyMutationInput.schema';
import { TaggingUncheckedUpdateManyWithoutTaggingsInputObjectSchema } from './TaggingUncheckedUpdateManyWithoutTaggingsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateManyWithWhereWithoutUserInput> = z
	.object({
		where: z.lazy(() => TaggingScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => TaggingUpdateManyMutationInputObjectSchema),
			z.lazy(() => TaggingUncheckedUpdateManyWithoutTaggingsInputObjectSchema),
		]),
	})
	.strict();

export const TaggingUpdateManyWithWhereWithoutUserInputObjectSchema = Schema;
