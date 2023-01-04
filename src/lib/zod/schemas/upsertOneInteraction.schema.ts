import { z } from 'zod';
import { InteractionWhereUniqueInputObjectSchema } from './objects/InteractionWhereUniqueInput.schema';
import { InteractionCreateInputObjectSchema } from './objects/InteractionCreateInput.schema';
import { InteractionUncheckedCreateInputObjectSchema } from './objects/InteractionUncheckedCreateInput.schema';
import { InteractionUpdateInputObjectSchema } from './objects/InteractionUpdateInput.schema';
import { InteractionUncheckedUpdateInputObjectSchema } from './objects/InteractionUncheckedUpdateInput.schema';

export const InteractionUpsertSchema = z.object({
	where: InteractionWhereUniqueInputObjectSchema,
	create: z.union([
		InteractionCreateInputObjectSchema,
		InteractionUncheckedCreateInputObjectSchema,
	]),
	update: z.union([
		InteractionUpdateInputObjectSchema,
		InteractionUncheckedUpdateInputObjectSchema,
	]),
});
