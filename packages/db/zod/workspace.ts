import * as z from 'zod';

export const WorkspaceModel = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.date().nullish(),
	slug: z.string(),
});
