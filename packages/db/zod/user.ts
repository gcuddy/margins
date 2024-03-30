import * as z from 'zod';

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const UserModel = z.object({
	id: z.string(),
	workspaceID: z.string().nullish(),
	createdAt: z.date(),
	updatedAt: z.date(),
	email: z.string(),
	username: z.string().nullish(),
	default_state_id: z.number().int().nullish(),
	default_archive_id: z.number().int().nullish(),
	home_items: jsonSchema,
	avatar: z.string().nullish(),
	email_verified: z.boolean().nullish(),
});
