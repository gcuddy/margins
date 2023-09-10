import { z } from 'zod';

export const collectionItemSchema = z.object({
	collectionId: z.number().int(),
	id: z.string().optional(),
});

export const collectionItemInput = z.object({
	position: z.number().int().optional(),
	width: z.enum(['default', 'wide']).optional(),
});

export const collectionItemUpdateInputSchema = z.object({
	data: collectionItemInput,
	id: z.string(),
});
