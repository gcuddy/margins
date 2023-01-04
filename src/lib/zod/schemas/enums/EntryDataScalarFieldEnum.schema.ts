import { z } from 'zod';

export const EntryDataScalarFieldEnumSchema = z.enum([
	'id',
	'html',
	'text',
	'custom',
	'image',
	'wordCount',
	'summary',
	'data',
	'published',
	'updated',
	'createdAt',
	'updatedAt',
	'entryId',
	'userId',
]);
