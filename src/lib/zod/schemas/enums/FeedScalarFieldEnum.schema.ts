import { z } from 'zod';

export const FeedScalarFieldEnumSchema = z.enum([
	'id',
	'itunes_id',
	'feedUrl',
	'title',
	'link',
	'creator',
	'description',
	'lastBuildDate',
	'imageUrl',
	'podcast',
	'createdAt',
	'updatedAt',
	'active',
	'velocity',
]);
