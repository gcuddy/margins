import { z } from 'zod';
import { SmartListUpdateInputObjectSchema } from './objects/SmartListUpdateInput.schema';
import { SmartListUncheckedUpdateInputObjectSchema } from './objects/SmartListUncheckedUpdateInput.schema';
import { SmartListWhereUniqueInputObjectSchema } from './objects/SmartListWhereUniqueInput.schema';

export const SmartListUpdateOneSchema = z.object({
	data: z.union([SmartListUpdateInputObjectSchema, SmartListUncheckedUpdateInputObjectSchema]),
	where: SmartListWhereUniqueInputObjectSchema,
});
