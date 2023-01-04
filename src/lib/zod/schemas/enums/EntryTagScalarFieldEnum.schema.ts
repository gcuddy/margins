import { z } from 'zod';

export const EntryTagScalarFieldEnumSchema = z.enum([
	'createdAt',
	'updatedAt',
	'tagId',
	'entryId',
	'userId',
]);
