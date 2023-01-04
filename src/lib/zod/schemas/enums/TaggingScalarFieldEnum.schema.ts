import { z } from 'zod';

export const TaggingScalarFieldEnumSchema = z.enum([
	'id',
	'tagId',
	'userId',
	'feedId',
	'annotationId',
	'bookmarkId',
]);
