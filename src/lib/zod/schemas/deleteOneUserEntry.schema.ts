import { z } from 'zod';
import { UserEntryWhereUniqueInputObjectSchema } from './objects/UserEntryWhereUniqueInput.schema';

export const UserEntryDeleteOneSchema = z.object({ where: UserEntryWhereUniqueInputObjectSchema });
