import { z } from 'zod';

const WebPageElementSchema = z.object({
	'@type': z.literal('WebPageElement'),
	cssSelector: z.string(),
});

const AuthorSchema = z.object({
	'@type': z.literal('Person'),
	name: z.string(),
});

const ImageSchema = z.object({
	'@type': z.literal('ImageObject'),
	url: z.string(),
});

// export const getImageFromSchema = (schema: z.infer<typeof ImageSchema>) =>
// 	schema.url;

export const ArticleSchema = z
	.object({
		'@type': z.enum(['Article', 'NewsArticle', 'Blog']),
		author: z.string().or(AuthorSchema).or(AuthorSchema.array()).optional(),
		datePublished: z.string().optional(),
		description: z.string().optional(),
		hasPart: WebPageElementSchema.optional(),
		headline: z
			.string()
			.optional()
			.transform((t) => t?.trim()),
		image: z.string().or(ImageSchema).or(ImageSchema.array()).optional(),
		name: z.string().optional(),
		url: z.string().optional(),

		wordCount: z.coerce.number().optional(),
		// This is a common mistake in schema.org data
		wordcount: z.coerce.number().optional(),
	})
	.passthrough();

// export const getAuthorFromSchema = (schema: z.infer<typeof AuthorSchema>) =>
// 	schema.name;
//

export const getAuthorFromSchema = (
	schema: z.infer<typeof ArticleSchema>,
): string[] | undefined => {
	if (typeof schema.author === 'string') return [schema.author];
	if (Array.isArray(schema.author)) {
		return schema.author.map((a) => a.name);
	} else if (schema.author) {
		return [schema.author.name];
	}
};

export const getImageFromSchema = (
	schema: z.infer<typeof ArticleSchema>,
): string[] | undefined => {
	if (typeof schema.image === 'string') return [schema.image];
	if (Array.isArray(schema.image)) {
		return schema.image.map((a) => a.url);
	} else if (schema.image) {
		return [schema.image.url];
	}
};
