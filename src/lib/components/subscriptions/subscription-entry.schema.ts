import { z } from 'zod';

export const feedSearchFormSchema = z.object({
	url: z.string().url(),
});

export type FeedSearchFormSchema = typeof feedSearchFormSchema;

export const feedAddFormSchema = z
	.object({
		title: z.string(),
		url: z.string(),
	})
	.array();

export type FeedAddFormSchema = typeof feedAddFormSchema;
