import { z } from "zod";

export function makeSchemaOptional<T extends z.ZodTypeAny>(schema: T) {
	return schema.optional();
}
export function makeObjectOptionallyBeArray<T extends z.ZodTypeAny>(schema: T) {
	return schema.or(z.array(schema));
}
