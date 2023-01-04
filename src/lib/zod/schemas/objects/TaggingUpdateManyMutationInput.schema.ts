import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateManyMutationInput> = z.object({}).strict();

export const TaggingUpdateManyMutationInputObjectSchema = Schema;
