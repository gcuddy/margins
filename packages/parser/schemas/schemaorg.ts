import { z } from 'zod';

const WebPageElementSchema = z.object({
	'@type': z.literal('WebPageElement'),
	cssSelector: z.string(),
});

export const ArticleSchema = z
	.object({
		'@type': z.literal('Article'),
		author: z.string().optional(),
		datePublished: z.string().optional(),
		description: z.string().optional(),
		hasPart: WebPageElementSchema.optional(),
		headline: z.string().optional(),
		image: z.string().optional(),
		name: z.string().optional(),
		url: z.string().optional(),

		wordCount: z.coerce.number().optional(),
		// This is a common mistake in schema.org data
wordcount: z.coerce.number().optional(),
	})
	.passthrough();
