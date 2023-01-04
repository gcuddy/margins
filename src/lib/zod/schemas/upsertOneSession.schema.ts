import { z } from 'zod';
import { SessionWhereUniqueInputObjectSchema } from './objects/SessionWhereUniqueInput.schema';
import { SessionCreateInputObjectSchema } from './objects/SessionCreateInput.schema';
import { SessionUncheckedCreateInputObjectSchema } from './objects/SessionUncheckedCreateInput.schema';
import { SessionUpdateInputObjectSchema } from './objects/SessionUpdateInput.schema';
import { SessionUncheckedUpdateInputObjectSchema } from './objects/SessionUncheckedUpdateInput.schema';

export const SessionUpsertSchema = z.object({
	where: SessionWhereUniqueInputObjectSchema,
	create: z.union([SessionCreateInputObjectSchema, SessionUncheckedCreateInputObjectSchema]),
	update: z.union([SessionUpdateInputObjectSchema, SessionUncheckedUpdateInputObjectSchema]),
});
