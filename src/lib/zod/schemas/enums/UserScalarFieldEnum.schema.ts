import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum([
	'id',
	'provider_id',
	'hashed_password',
	'createdAt',
	'updatedAt',
	'email',
	'username',
	'default_state_id',
]);
