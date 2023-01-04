import { z } from 'zod';

export const ContextScalarFieldEnumSchema = z.enum([
	'id',
	'createdAt',
	'userId',
	'entryId',
	'feedId',
	'url',
	'description',
]);
