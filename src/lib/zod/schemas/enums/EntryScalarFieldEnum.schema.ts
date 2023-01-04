import { z } from 'zod';

export const EntryScalarFieldEnumSchema = z.enum([
	'createdAt',
	'author',
	'location',
	'title',
	'type',
	'updatedAt',
	'id',
	'uri',
	'html',
	'text',
	'image',
	'guid',
	'original',
	'wordCount',
	'siteName',
	'summary',
	'media',
	'published',
	'updated',
	'feedId',
]);
