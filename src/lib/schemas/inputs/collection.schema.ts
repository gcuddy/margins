import { z } from 'zod';

export const collectionItemInput = z.object({
	position: z.number().int().optional(),
	width: z.enum(['default', 'wide']).optional(),
});

export const collectionItemUpdateInputSchema = z.object({
	data: collectionItemInput,
	id: z.string(),
});
