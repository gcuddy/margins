import { z } from 'zod';

export const InteractionScalarFieldEnumSchema = z.enum([
	'id',
	'createdAt',
	'updatedAt',
	'is_read',
	'progress',
	'finished',
	'entryId',
	'userId',
	'last_viewed',
	'last_annotated',
	'last_interaction',
]);
