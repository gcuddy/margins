import { DocumentType } from '$lib/prisma/kysely/enums';
import { z } from 'zod';

export const entryNodeSchema = z.object({
	entryId: z.number().optional(),
	id: z.number().or(z.string()),
	type: z.nativeEnum(DocumentType),
	title: z.string().nullable(),
});
