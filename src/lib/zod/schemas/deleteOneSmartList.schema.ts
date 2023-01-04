import { z } from 'zod';
import { SmartListWhereUniqueInputObjectSchema } from './objects/SmartListWhereUniqueInput.schema';

export const SmartListDeleteOneSchema = z.object({ where: SmartListWhereUniqueInputObjectSchema });
