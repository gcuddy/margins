import { z } from 'zod';

const ArticleSortBySchema = z
	.literal('title')
	.or(z.literal('date'))
	.or(z.literal('author'))
	.or(z.literal('createdAt'));

export const ViewSchema = z.object({
	sort: ArticleSortBySchema,
	properties: z.object({
		author: z.boolean(),
		site: z.boolean(),
		description: z.boolean(),
		tags: z.boolean(),
		annotationCount: z.boolean(),
		date: z.boolean(),
		wordCount: z.boolean()
	})
});

export type ViewOptions = z.infer<typeof ViewSchema>;

export const viewOptions: ViewOptions = {
	sort: 'title',
	properties: {
		author: true,
		site: true,
		description: true,
		tags: true,
		annotationCount: true,
		date: false,
		wordCount: false
	}
};

// export type ViewOptions = typeof viewOptions;
