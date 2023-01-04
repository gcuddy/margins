import { z } from 'zod';

export const ContextNodeScalarFieldEnumSchema = z.enum([
	'id',
	'name',
	'url',
	'description',
	'userId',
	'refers_to',
]);
