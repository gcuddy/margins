import { z } from 'zod';
import { SmartListCreateInputObjectSchema } from './objects/SmartListCreateInput.schema';
import { SmartListUncheckedCreateInputObjectSchema } from './objects/SmartListUncheckedCreateInput.schema';

export const SmartListCreateOneSchema = z.object({
	data: z.union([SmartListCreateInputObjectSchema, SmartListUncheckedCreateInputObjectSchema]),
});
