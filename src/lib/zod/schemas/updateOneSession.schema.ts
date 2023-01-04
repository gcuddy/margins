import { z } from 'zod';
import { SessionUpdateInputObjectSchema } from './objects/SessionUpdateInput.schema';
import { SessionUncheckedUpdateInputObjectSchema } from './objects/SessionUncheckedUpdateInput.schema';
import { SessionWhereUniqueInputObjectSchema } from './objects/SessionWhereUniqueInput.schema';

export const SessionUpdateOneSchema = z.object({
	data: z.union([SessionUpdateInputObjectSchema, SessionUncheckedUpdateInputObjectSchema]),
	where: SessionWhereUniqueInputObjectSchema,
});
