import * as z from 'zod';

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const CollectionModel = z.object({
	id: z.number().int(),
	name: z.string(),
	private: z.boolean(),
	icon: z.string().nullish(),
	userId: z.string(),
	description: z.string().nullish(),
	createdAt: z.date(),
	updatedAt: z.date(),
	contentData: jsonSchema,
	viewOptions: jsonSchema,
	color: z.string().nullish(),
	bgColor: z.string().nullish(),
	font: z.string().nullish(),
	deleted: z.date().nullish(),
	defaultItemWidth: z.string().nullish(),
});
