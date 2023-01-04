import { z } from 'zod';

export const AnnotationScalarFieldEnumSchema = z.enum([
	'id',
	'createdAt',
	'updatedAt',
	'body',
	'type',
	'private',
	'target',
	'entryId',
	'parentId',
	'deleted',
	'userId',
	'sortOrder',
	'bookmarkId',
]);
