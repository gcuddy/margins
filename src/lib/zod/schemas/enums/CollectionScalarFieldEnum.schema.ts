import { z } from 'zod';

export const CollectionScalarFieldEnumSchema = z.enum([
	'id',
	'name',
	'private',
	'icon',
	'userId',
	'description',
	'createdAt',
	'updatedAt',
]);
