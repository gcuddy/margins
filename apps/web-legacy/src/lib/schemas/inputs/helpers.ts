import { z } from 'zod';

export const booleanNumberSchema = z.coerce
	.boolean()
	.transform((val) => (val ? 1 : 0));
