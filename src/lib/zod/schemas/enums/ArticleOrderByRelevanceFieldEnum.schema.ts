import { z } from 'zod';

export const ArticleOrderByRelevanceFieldEnumSchema = z.enum([
	'title',
	'content',
	'textContent',
	'author',
	'slug',
	'url',
	'siteName',
	'colorHash',
	'image',
	'css',
	'description',
	'wiki',
	'classification',
	'html',
	'location',
	'userId',
]);
