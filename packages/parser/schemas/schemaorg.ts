import { objectKeys } from '@margins/lib';
import { z } from 'zod';

const WebPageElementSchema = z.object({
	'@type': z.literal('WebPageElement'),
	cssSelector: z.string(),
});

const JustIdSchema = z
	.object({
		'@id': z.string().url(),
		'@type': z.string().optional(),
	})
	.passthrough();

const AuthorSchema = z.object({
	'@type': z.literal('Person'),
	name: z.string(),
});

// TODO: expand on this
const ImageSchema = z.object({
	'@type': z.literal('ImageObject'),
	url: z.string(),
});

export const BaseSchema = z
	.object({
		'@id': z.string().url().optional(),
		'@type': z.string().optional(),
	})
	.passthrough();

export const GraphSchema = z.object({
	'@context': z.literal('https://schema.org'),
	'@graph': z.array(JustIdSchema).optional(),
});

export const BaseThingSchema = z.object({
	'@type': z.literal('Thing'),
	description: z.string().optional(),
	image: z.union([z.string(), ImageSchema]).optional(),
	name: z.string().optional(),
	url: z.string().optional(),
});

export const CreativeWorkSchema = BaseThingSchema.extend({
	'@type': z.literal('CreativeWork'),
	datePublished: z.coerce.date(),
	thumbnailUrl: z.string().url().optional(),
});

// NOTE: maybe we should use z.string instead of z.literal to match more widely
export const WebPageSchema = CreativeWorkSchema.extend({
	'@type': z.literal('WebPage'),
});

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

type IdSchema = z.infer<typeof BaseSchema>;

/**
 * Resolves the '@graph' key of a schema
 * @param data - An array of graph nodes from the '@graph' key
 */
export function resolveGraph<TSchema extends IdSchema>(data: TSchema[]) {
	const idMap = new Map(data.map((d) => [d['@id'], d]));

	function deepReplace(item: TSchema): TSchema | undefined {
		if (item['@id'] && Object.keys(item).length === 1) {
			return idMap.get(item['@id']);
		}
		objectKeys(item).forEach((key) => {
			if (typeof item[key] === 'object') {
				// @ts-expect-error - we need to type this a bit better, it's inferring that the value has to be string | undefined
				const val = deepReplace(item[key]);
				// @ts-expect-error - tschema constraint error we should fix
				if (val) item[key] = val;
			}
		});
		return item;
	}

	return data.map(deepReplace);
}
