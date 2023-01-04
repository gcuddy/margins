import { z } from 'zod';

export const EntryMediaScalarFieldEnumSchema = z.enum([
	'id',
	'url',
	'size',
	'duration',
	'type',
	'title',
	'documentDataId',
	'entryId',
]);
