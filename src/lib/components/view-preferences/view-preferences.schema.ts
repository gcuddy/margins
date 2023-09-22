import { z } from 'zod';

export const ViewPreferencesSchema = z.object({
	annotations: z.boolean().default(true),
	attachment: z.boolean().default(true),
	author: z.boolean().default(true),
	date: z.boolean().default(true),
	description: z.boolean().default(true),
	image: z.boolean().default(true),
	pageNote: z.boolean().default(true),
	progress: z.boolean().default(true),
	relations: z.boolean().default(true),
	savedAt: z.boolean().default(true),
	seen: z.boolean().default(true),
	site: z.boolean().default(true),
	status: z.boolean().default(false),
	tags: z.boolean().default(true),
	time: z.boolean().default(true),
	type: z.boolean().default(true),
	url: z.boolean().default(true),
	wordCount: z.boolean().default(false),
});

export type ViewPreferences = z.infer<typeof ViewPreferencesSchema>;

export const defaultViewPreferences: ViewPreferences = {
	annotations: true,
	attachment: true,
	author: true,
	date: true,
	description: true,
	image: true,
	pageNote: true,
	progress: true,
	relations: true,
	savedAt: true,
	seen: true,
	site: true,
	status: false,
	tags: true,
	time: true,
	type: true,
	url: true,
	wordCount: false,
};

export const viewPreferencesKeys = Object.keys(
	ViewPreferencesSchema.shape,
) as Array<keyof ViewPreferences>;
