import { z } from 'zod';

export const ContextOrderByRelevanceFieldEnumSchema = z.enum(['userId', 'url', 'description']);
