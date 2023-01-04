import { z } from 'zod';
import { SmartListWhereUniqueInputObjectSchema } from './objects/SmartListWhereUniqueInput.schema';

export const SmartListFindUniqueSchema = z.object({ where: SmartListWhereUniqueInputObjectSchema });
