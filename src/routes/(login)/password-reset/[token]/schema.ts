import { createUserSchema } from '../../schema';

export const passwordSchema = createUserSchema.pick({
	password: true,
});
