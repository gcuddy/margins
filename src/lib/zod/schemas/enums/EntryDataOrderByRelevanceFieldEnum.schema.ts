import { z } from 'zod';

export const EntryDataOrderByRelevanceFieldEnumSchema = z.enum([
	'html',
	'text',
	'image',
	'summary',
	'userId',
]);
