// could use prisma-to-zod to generate this schema
// i kind of like to do it myself, but i should probably use prisma-to-zod lol

import type { Article } from '@prisma/client';
import { z } from 'zod';
import { LocationSchema } from './Locations';

type a = Article;

export const ArticleSchema = z.object({
	id: z.number().int().nonnegative(),
	title: z.string(),
	content: z.string(),
	textContent: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	readProgess: z.number().gte(0).lte(1),
	siteName: z.string().nullable(),
	date: z.date(),
	image: z.string(),
	starred: z.boolean(),
	position: z.number().int().nonnegative(),
	location: LocationSchema,
	trash: z.boolean()
});
// this is without relations!

export const PatchArticleData = ArticleSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true
}).partial();
