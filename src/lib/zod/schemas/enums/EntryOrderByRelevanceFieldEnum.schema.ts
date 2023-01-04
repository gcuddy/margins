import { z } from 'zod';

export const EntryOrderByRelevanceFieldEnumSchema = z.enum([
	'author',
	'title',
	'uri',
	'html',
	'text',
	'image',
	'guid',
	'siteName',
	'summary',
]);
