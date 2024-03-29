import { z } from 'zod';

export const RssFeedItemModel = z.object({
	id: z.number().int(),
	uuid: z.string(),
	duration: z.number().int().nullish(),
	image: z.string().nullish(),
	link: z.string().nullish(),
	author: z.string().nullish(),
	title: z.string().nullish(),
	content: z.string().nullish(),
	contentSnippet: z.string().nullish(),
	pubDate: z.date().nullish(),
	createdAt: z.date(),
	updatedAt: z.date(),
	rssFeedId: z.number().int(),
});

export const ArticleModel = z.object({
	id: z.number().int(),
	title: z.string(),
	content: z.string().nullish(),
	textContent: z.string().nullish(),
	author: z.string().nullish(),
	createdAt: z.date(),
	updatedAt: z.date(),
	readProgress: z.number(),
	url: z.string().nullish(),
	siteName: z.string().nullish(),
	colorHash: z.string().nullish(),
	date: z.date(),
	image: z.string(),
	wordCount: z.number().int().nullish(),
	starred: z.boolean(),
	css: z.string().nullish(),
	description: z.string().nullish(),
	wiki: z.string().nullish(),
	classification: z.string().nullish(),
	pdf: z.boolean().nullish(),
	html: z.string().nullish(),
	feedItemId: z.number().int().nullish(),
	position: z.number().int(),
	trash: z.boolean(),
	location: z.string(),
	type: z.number().int(),
	userId: z.string(),
});

export const FavoriteModel = z.object({
	id: z.number().int(),
	position: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userId: z.string(),
	articleId: z.number().int().nullish(),
	tagId: z.number().int().nullish(),
	rssId: z.number().int().nullish(),
	smartListId: z.number().int().nullish(),
});

export const RssFeedModel = z.object({
	id: z.number().int(),
	itunes_id: z.string().nullish(),
	feedUrl: z.string(),
	title: z.string().nullish(),
	link: z.string().nullish(),
	description: z.string().nullish(),
	lastBuildDate: z.date().nullish(),
	imageUrl: z.string().nullish(),
	podcast: z.boolean(),
	creator: z.string().nullish(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
