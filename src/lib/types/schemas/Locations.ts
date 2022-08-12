import { z } from 'zod';

export const LocationSchema = z
	.literal('INBOX')
	.or(z.literal('SOON'))
	.or(z.literal('LATER'))
	.or(z.literal('ARCHIVE'));
