import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './objects/ContextWhereUniqueInput.schema';

export const ContextFindUniqueSchema = z.object({ where: ContextWhereUniqueInputObjectSchema });
