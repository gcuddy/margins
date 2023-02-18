import { Color } from "@prisma/client";
import { z } from "zod";

import { TargetSchema } from "./zod-utils";

export const saveColorDescriptionSchema = z.object({
    color: z.nativeEnum(Color),
    description: z.string().optional()
})

export const saveAnnotationSchema = z.object({
    target: TargetSchema,
    body: z.string(),
    id: z.number(),
    entryId: z.number(),
    private: z.boolean(),
    color: z.nativeEnum(Color),
});


const updateSchema = z.object({
	body: z.string().optional(),
	private: z.boolean().optional(),
	tags: z.string().or(z.array(z.string())).transform(
		(tags) => (typeof tags === "string" ? tags.split(",") : tags)
	).optional(),
});
