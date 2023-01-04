import { z } from 'zod';

export const SubscriptionScalarFieldEnumSchema = z.enum([
	'id',
	'feedId',
	'userId',
	'createdAt',
	'updatedAt',
	'title',
	'download_full',
]);
