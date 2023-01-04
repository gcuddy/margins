import { z } from 'zod';

export const ContextNodeOrderByRelevanceFieldEnumSchema = z.enum([
	'id',
	'name',
	'url',
	'description',
	'userId',
	'refers_to',
]);
