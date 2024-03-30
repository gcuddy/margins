import * as z from 'zod';

export const InvitationCodeModel = z.object({
	code: z.string(),
	used: z.boolean(),
	ownerId: z.string(),
	usedById: z.string().nullish(),
});
