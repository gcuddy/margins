import { z } from 'zod';

export const SessionScalarFieldEnumSchema = z.enum(['id', 'user_id', 'expires', 'idle_expires']);
