import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryCreateWithoutStylesheetInput> = z.object({}).strict();

export const UserEntryCreateWithoutStylesheetInputObjectSchema = Schema;
