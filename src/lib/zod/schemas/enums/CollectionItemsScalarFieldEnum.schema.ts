import { z } from 'zod';

export const CollectionItemsScalarFieldEnumSchema = z.enum([
	'id',
	'collectionId',
	'position',
	'type',
	'createdAt',
	'updatedAt',
	'annotationId',
	'bookmarkId',
]);
