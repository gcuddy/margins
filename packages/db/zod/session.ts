import * as z from 'zod';

export const SessionModel = z.object({
	id: z.string(),
	user_id: z.string(),
	expires_at: z.date(),
});
