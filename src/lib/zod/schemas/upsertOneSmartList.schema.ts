import { z } from 'zod';
import { SmartListWhereUniqueInputObjectSchema } from './objects/SmartListWhereUniqueInput.schema';
import { SmartListCreateInputObjectSchema } from './objects/SmartListCreateInput.schema';
import { SmartListUncheckedCreateInputObjectSchema } from './objects/SmartListUncheckedCreateInput.schema';
import { SmartListUpdateInputObjectSchema } from './objects/SmartListUpdateInput.schema';
import { SmartListUncheckedUpdateInputObjectSchema } from './objects/SmartListUncheckedUpdateInput.schema';

export const SmartListUpsertSchema = z.object({
	where: SmartListWhereUniqueInputObjectSchema,
	create: z.union([SmartListCreateInputObjectSchema, SmartListUncheckedCreateInputObjectSchema]),
	update: z.union([SmartListUpdateInputObjectSchema, SmartListUncheckedUpdateInputObjectSchema]),
});
