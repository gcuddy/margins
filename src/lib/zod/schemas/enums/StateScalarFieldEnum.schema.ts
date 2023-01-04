import { z } from 'zod';

export const StateScalarFieldEnumSchema = z.enum([
	'id',
	'read_later',
	'name',
	'color',
	'type',
	'position',
	'description',
	'userId',
	'default',
	'createdAt',
	'updatedAt',
]);
