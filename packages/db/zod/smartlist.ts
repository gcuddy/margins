import * as z from 'zod';
import { EntryFilterType } from '@prisma/client';

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const SmartListModel = z.object({
	id: z.number().int(),
	name: z.string(),
	filter: jsonSchema,
	viewOptions: jsonSchema,
	conditions: jsonSchema,
	icon: jsonSchema,
	createdAt: z.date(),
	description: z.string().nullish(),
	private: z.boolean(),
	updatedAt: z.date(),
	userId: z.string(),
	entryFilterType: z.nativeEnum(EntryFilterType),
	filterData: jsonSchema,
});
