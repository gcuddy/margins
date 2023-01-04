import { z } from 'zod';

export const SmartListScalarFieldEnumSchema = z.enum(['id', 'name', 'filter', 'viewOptions']);
