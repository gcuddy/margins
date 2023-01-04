import { z } from 'zod';

export const FavoriteFolderScalarFieldEnumSchema = z.enum([
	'id',
	'name',
	'createdAt',
	'updatedAt',
	'userId',
]);
