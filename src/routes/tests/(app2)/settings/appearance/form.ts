import { themeSchema } from '$lib/features/settings/themes';
import { z } from 'zod';

export const appearanceFormSchema = z.object({
	theme: themeSchema,
});

export type AppearanceFormSchema = typeof appearanceFormSchema;
