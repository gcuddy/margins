import { z } from 'zod';

export const TagScalarFieldEnumSchema = z.enum([
	'id',
	'name',
	'createdAt',
	'updatedAt',
	'viewOptions',
	'userId',
]);
