import { z } from 'zod';

export const AnnotationTypeSchema = z.enum(['bookmark', 'note', 'annotation', 'reply']);
