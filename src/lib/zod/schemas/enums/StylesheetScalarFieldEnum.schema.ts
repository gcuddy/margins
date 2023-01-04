import { z } from 'zod';

export const StylesheetScalarFieldEnumSchema = z.enum([
	'id',
	'domain',
	'css',
	'userEntryId',
	'userId',
]);
