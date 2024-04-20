import { z } from 'zod';

export type Article = {
	author: string;
	html: string;
	image: string;
	published: Date;
	summary: string;
	text: string;
	title: string;
	url: string;
	wordCount: number;
};

export const ArticleSchema = z.object({
	author: z.string(),
	html: z.string(),
	image: z.string(),
	published: z.coerce.date(),
	summary: z.string(),
	text: z.string(),
	title: z.string(),
	url: z.string(),
	wordCount: z.coerce.number(),
}) satisfies z.ZodType<Article>;
