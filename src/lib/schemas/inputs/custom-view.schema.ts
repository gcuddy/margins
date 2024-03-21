import { z } from 'zod';
import { jsonSchema } from '../types';
import { EntryFilterType } from '$lib/prisma/kysely/enums';

export const customViewCreateInputSchema = z
	.object({
		color: z.string(),
		entryFilterType: z.nativeEnum(EntryFilterType),
		filterData: jsonSchema,
		icon: z.string(),
		name: z.string(),
	})
	.partial()
	.required({
		name: true,
	});
