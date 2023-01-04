import { z } from 'zod';
import { UserEntryWhereUniqueInputObjectSchema } from './objects/UserEntryWhereUniqueInput.schema';

export const UserEntryFindUniqueSchema = z.object({ where: UserEntryWhereUniqueInputObjectSchema });
