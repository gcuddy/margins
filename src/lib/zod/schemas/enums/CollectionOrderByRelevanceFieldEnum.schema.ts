import { z } from 'zod';

export const CollectionOrderByRelevanceFieldEnumSchema = z.enum(['name', 'userId', 'description']);
