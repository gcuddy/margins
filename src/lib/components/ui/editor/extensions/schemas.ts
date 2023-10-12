import { DocumentType } from '@prisma/client';
import { z } from 'zod';

export const entryNodeSchema = z.object({
	id: z.number(),
	type: z.nativeEnum(DocumentType),
	title: z.string().nullable(),
});
