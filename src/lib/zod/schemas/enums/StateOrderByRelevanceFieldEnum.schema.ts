import { z } from 'zod';

export const StateOrderByRelevanceFieldEnumSchema = z.enum([
	'name',
	'color',
	'description',
	'userId',
]);
