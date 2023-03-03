import { z } from 'zod';

const textNode = z.object({
	'#text': z.string(),
});

const guid = z.union([
	z.string(),
	textNode.extend({
		guid: z.string(),
	}),
]);

type Guid = z.infer<typeof guid>;

export const jsonFeedSchema = z.object({
	version: z.string().regex(/^https:\/\/jsonfeed.org\/version\/1/),
	title: z.string(),
	home_page_url: z.string().url().optional(),
	feed_url: z.string().url().optional(),
	description: z.string().optional(),
	icon: z.string().url().optional(),
	favicon: z.string().url().optional(),
	authors: z
		.array(
			z.object({
				name: z.string().optional(),
			})
		)
		.optional(),
	items: z.array(
		z.object({
			id: z.string(),
			url: z.string().url().optional(),
			external_url: z.string().url().optional(),
			title: z.string().optional(),
			content_html: z.string().optional(),
			content_text: z.string().optional(),
			summary: z.string().optional(),
			image: z.string().url().optional(),
			banner_image: z.string().url().optional(),
			date_published: z.string().optional(),
			date_modified: z.string().optional(),
			authors: z
				.array(
					z.object({
						name: z.string().optional(),
					})
				)
				.optional(),
		})
	),
});

export const rssSchema = z.object({
	title: z.string(),
	link: z.string(),
	description: z.string(),
	language: z.string().optional(),
	lastBuildDate: z.string().optional(),
	item: z.array(
		z
			.object({
				title: z.string(),
				link: z.string(),
				description: z.string(),
				author: z.string(),
				pubDate: z.string(),
				guid,
			})
			.partial()
	),
});

export const atomSchema = z.object({
	id: z.string(),
	title: z.string(),
	update: z.string(),
	author: z
		.object({
			name: z.string(),
		})
		.optional(),
	link: z.string().optional(),
	entry: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			updated: z.string(),
			author: z
				.object({
					name: z.string(),
				})
				.optional(),
			content: z.string().optional(),
			link: z.string().optional(),
			summary: z.string().optional(),
			published: z.string(),
			guid,
		})
	),
});

export const rssOrAtom = z.union([rssSchema, atomSchema]);
