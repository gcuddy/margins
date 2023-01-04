import { z } from 'zod';

export const FavoriteScalarFieldEnumSchema = z.enum([
	'id',
	'createdAt',
	'updatedAt',
	'userId',
	'deleted',
	'tagId',
	'rssId',
	'smartListId',
	'favoriteFolderId',
	'annotationId',
	'bookmarkId',
]);
