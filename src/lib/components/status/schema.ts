import { Status } from '$lib/types/enums';
import { z } from 'zod';

export const statusUpdateSchema = z.object({
	status: z.nativeEnum(Status),
	// type: z.string().optional(),
	// id: z.string().or(z.number()).optional(),
	// entryId: z.number().optional(),
	// bookmarkId: z.number().optional(),
});
// .refine(data => {
//     // we need
// })
