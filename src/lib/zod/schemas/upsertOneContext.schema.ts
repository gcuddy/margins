import { z } from 'zod';
import { ContextWhereUniqueInputObjectSchema } from './objects/ContextWhereUniqueInput.schema';
import { ContextCreateInputObjectSchema } from './objects/ContextCreateInput.schema';
import { ContextUncheckedCreateInputObjectSchema } from './objects/ContextUncheckedCreateInput.schema';
import { ContextUpdateInputObjectSchema } from './objects/ContextUpdateInput.schema';
import { ContextUncheckedUpdateInputObjectSchema } from './objects/ContextUncheckedUpdateInput.schema';

export const ContextUpsertSchema = z.object({
	where: ContextWhereUniqueInputObjectSchema,
	create: z.union([ContextCreateInputObjectSchema, ContextUncheckedCreateInputObjectSchema]),
	update: z.union([ContextUpdateInputObjectSchema, ContextUncheckedUpdateInputObjectSchema]),
});
