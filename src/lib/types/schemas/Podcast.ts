import { z } from 'zod';

export const PodcastEpisodeSchema = z.object({
	id: z.number().int(),
	title: z.string(),
	description: z.string().optional(),
	enclosure: z.object({
		url: z.string(),
		length: z.number(),
		type: z.string(),
	}),
	guid: z.string().optional(),
	pubDate: z.string().or(z.date()).optional(),
	'itunes:duration': z.string().optional(),
});

export const PodcastSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	image: z.string().optional(),
	items: z.array(PodcastEpisodeSchema),
	creator: z.string().optional(),
	url: z.string(),
	id: z.string(),
});

export type PodcastEpisode = z.infer<typeof PodcastEpisodeSchema>;

export type Podcast = z.infer<typeof PodcastSchema>;
