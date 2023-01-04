import { z } from 'zod';
import { AnnotationCreateManyInputObjectSchema } from './objects/AnnotationCreateManyInput.schema';

export const AnnotationCreateManySchema = z.object({ data: AnnotationCreateManyInputObjectSchema });
