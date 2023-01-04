import { z } from 'zod';

export const CollectionItemTypeSchema = z.enum(['ARTICLE', 'BOOKMARK', 'COLLECTION']);
