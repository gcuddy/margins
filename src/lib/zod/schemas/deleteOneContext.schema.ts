import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './objects/ContextWhereUniqueInput.schema';

export const ContextDeleteOneSchema = z.object({ where: ContextWhereUniqueInputObjectSchema });
