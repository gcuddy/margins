import { createUserSchema } from '../schema';

export const emailSchema = createUserSchema.pick({
	email: true,
});
