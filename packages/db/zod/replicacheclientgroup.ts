import * as z from 'zod';

export const ReplicacheClientGroupModel = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.date().nullish(),
	cvrVersion: z.number().int(),
	clientVersion: z.number().int(),
});
