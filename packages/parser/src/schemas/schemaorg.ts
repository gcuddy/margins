import { objectKeys } from '@margins/lib';
import { z } from 'zod';

const WebPageElementSchema = z.object({
	'@type': z.literal('WebPageElement'),
	cssSelector: z.string(),
});

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

export type BaseSchema = z.infer<typeof BaseSchema>;

export const JustIdSchema = BaseSchema.required({
	'@id': true,
}).passthrough();

export const GraphSchema = z.object({
	'@context': z.literal('https://schema.org'),
	'@graph': z.array(JustIdSchema).optional(),
});

export const BaseThingSchema = z.object({
	'@type': z.literal('Thing'),
	description: z.string().optional(),
	image: z.string().or(ImageSchema).or(ImageSchema.array()).optional(),
	name: z.string().optional(),
	url: z.string().optional(),
});

export const CreativeWorkSchema = BaseThingSchema.extend({
	// NOTE: obviously doing a literal and string is kind of pointless,
	// but keeping it around since matching any string allows anything derived from creative work to get matched
	'@type': z.literal('CreativeWork').or(z.string()),
	author: z.string().or(AuthorSchema).or(AuthorSchema.array()).optional(),
	datePublished: z.coerce.date(),
	thumbnailUrl: z.string().url().optional(),
});

export type CreativeWorkSchema = z.infer<typeof CreativeWorkSchema>;

// NOTE: maybe we should use z.string instead of z.literal to match more widely
export const WebPageSchema = CreativeWorkSchema.extend({
	'@type': z.literal('WebPage'),
});

export type WebPageSchema = z.infer<typeof WebPageSchema>;

export const ARTICLE_TYPES = ['Article', 'NewsArticle', 'Blog'] as const;
export type ArticleType = (typeof ARTICLE_TYPES)[number];

export const ArticleSchema = CreativeWorkSchema.extend({
	'@type': z.enum(ARTICLE_TYPES),
	hasPart: WebPageElementSchema.optional(),
	headline: z
		.string()
		.optional()
		.transform((t) => t?.trim()),

	wordCount: z.coerce.number().optional(),
	// This is a common mistake in schema.org data
	wordcount: z.coerce.number().optional(),
}).passthrough();

export type ArticleSchema = z.infer<typeof ArticleSchema>;

export type SchemaData = ArticleSchema | CreativeWorkSchema;

export function isArticle(schema: SchemaData): schema is ArticleSchema {
	return ARTICLE_TYPES.includes(schema['@type'] as ArticleType);
}
// export const getAuthorFromSchema = (schema: z.infer<typeof AuthorSchema>) =>
// 	schema.name;
//

export const getAuthorFromSchema = (
	schema: SchemaData,
): string[] | undefined => {
	if (typeof schema.author === 'string') return [schema.author];
	if (Array.isArray(schema.author)) {
		return schema.author.map((a) => a.name);
	} else if (schema.author) {
		return [schema.author.name];
	}
};

export const getImageFromSchema = (
	schema: SchemaData,
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
 * Resolves JSON-LD graphs of linked data. @see {@link https://www.w3.org/TR/2014/REC-json-ld-20140116/#node-identifiers}
 * @param data - An array of graph nodes
 */
export function resolveGraph<TSchema extends IdSchema>(
	data: TSchema[],
): (TSchema & {
	'@type': string;
})[] {
	if (data.some((d) => !d['@id'])) {
		// then there is a missing '@id' in the data, just return the data
		return data as any;
	}
	const idMap = new Map(data.map((d) => [d['@id'], d]));

	function deepReplace(item: TSchema): TSchema {
		if (item['@id'] && Object.keys(item).length === 1) {
			return idMap.get(item['@id'])!;
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

	return data.map(deepReplace) as any;
}
