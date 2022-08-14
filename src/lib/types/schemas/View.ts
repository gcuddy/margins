import { z } from 'zod';

const ArticleSortBySchema = z
	.literal('title')
	.or(z.literal('date'))
	.or(z.literal('author'))
	.or(z.literal('createdAt'));

export const ViewSchema = z.object({
	sort: ArticleSortBySchema
});

export type ViewOptions = z.infer<typeof ViewSchema>;
