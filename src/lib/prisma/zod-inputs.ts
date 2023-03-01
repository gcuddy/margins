import { AnnotationType, Color } from "@prisma/client";
import { z } from "zod";

import { chosenIcon, TargetSchema } from "$lib/prisma/zod-utils";

export const saveColorDescriptionSchema = z.object({
    color: z.nativeEnum(Color),
    description: z.string().optional()
})

export const saveAnnotationSchema = z.object({
    target: TargetSchema,
    body: z.string(),
    id: z.string(),
    entryId: z.number(),
    private: z.boolean(),
    color: z.nativeEnum(Color),
    type: z.nativeEnum(AnnotationType).default("annotation"),
    contentData: z.object({}).passthrough(),
    title: z.string(),
    collectionId: z.number(),
    chosenIcon: chosenIcon,
   tags: z.array(z.object({
        id: z.number().optional(),
        name: z.string()
    }))
});


const updateSchema = z.object({
    body: z.string().optional(),
    private: z.boolean().optional(),
    tags: z.string().or(z.array(z.string())).transform(
        (tags) => (typeof tags === "string" ? tags.split(",") : tags)
    ).optional(),
});
