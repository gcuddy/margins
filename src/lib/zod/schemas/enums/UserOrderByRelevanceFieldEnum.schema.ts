import { z } from 'zod';

export const UserOrderByRelevanceFieldEnumSchema = z.enum([
	'id',
	'provider_id',
	'hashed_password',
	'email',
	'username',
]);
