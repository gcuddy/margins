import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryUpdateManyMutationInput> = z.object({}).strict();

export const UserEntryUpdateManyMutationInputObjectSchema = Schema;
