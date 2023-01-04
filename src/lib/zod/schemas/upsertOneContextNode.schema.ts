import { z } from 'zod';
import { ContextNodeWhereUniqueInputObjectSchema } from './objects/ContextNodeWhereUniqueInput.schema';
import { ContextNodeCreateInputObjectSchema } from './objects/ContextNodeCreateInput.schema';
import { ContextNodeUncheckedCreateInputObjectSchema } from './objects/ContextNodeUncheckedCreateInput.schema';
import { ContextNodeUpdateInputObjectSchema } from './objects/ContextNodeUpdateInput.schema';
import { ContextNodeUncheckedUpdateInputObjectSchema } from './objects/ContextNodeUncheckedUpdateInput.schema';

export const ContextNodeUpsertSchema = z.object({
	where: ContextNodeWhereUniqueInputObjectSchema,
	create: z.union([
		ContextNodeCreateInputObjectSchema,
		ContextNodeUncheckedCreateInputObjectSchema,
	]),
	update: z.union([
		ContextNodeUpdateInputObjectSchema,
		ContextNodeUncheckedUpdateInputObjectSchema,
	]),
});
