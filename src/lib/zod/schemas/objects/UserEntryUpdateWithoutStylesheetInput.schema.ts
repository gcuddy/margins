import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.UserEntryUpdateWithoutStylesheetInput> = z.object({}).strict();

export const UserEntryUpdateWithoutStylesheetInputObjectSchema = Schema;
