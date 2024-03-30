import * as z from 'zod';

export const UserFollowsModel = z.object({
	A: z.string(),
	B: z.string(),
});
