import { z } from 'zod';

export const DocumentTypeSchema = z.enum([
	'article',
	'rss',
	'pdf',
	'epub',
	'bookmark',
	'image',
	'video',
	'audio',
]);
