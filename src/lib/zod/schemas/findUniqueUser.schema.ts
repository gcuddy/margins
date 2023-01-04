import { z } from 'zod';
import { UserWhereUniqueInputObjectSchema } from './objects/UserWhereUniqueInput.schema';

export const UserFindUniqueSchema = z.object({ where: UserWhereUniqueInputObjectSchema });
