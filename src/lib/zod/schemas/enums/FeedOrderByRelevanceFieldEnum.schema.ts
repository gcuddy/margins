import { z } from 'zod';

export const FeedOrderByRelevanceFieldEnumSchema = z.enum([
	'itunes_id',
	'feedUrl',
	'title',
	'link',
	'creator',
	'description',
	'imageUrl',
]);
