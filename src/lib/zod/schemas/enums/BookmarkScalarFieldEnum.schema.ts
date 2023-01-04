import { z } from 'zod';

export const BookmarkScalarFieldEnumSchema = z.enum([
	'id',
	'createdAt',
	'updatedAt',
	'context',
	'uri',
	'entryId',
	'userId',
	'sortOrder',
	'is_read',
	'progress',
	'data',
	'stateId',
	'private',
	'interactionId',
	'favoriteId',
	'deleted',
]);
